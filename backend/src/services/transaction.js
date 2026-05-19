const { prisma } = require("../prisma/client");
const { createReferenceNo } = require("../utils/reference");
const { readCell, normalizeMovementType, readExcelRows, workbookBuffer } = require("../utils/excel");

const includeTransaction = {
  customer: true,
  fromLocation: true,
  toLocation: true,
  createdBy: { select: { id: true, name: true, email: true, role: true } },
  lines: { include: { product: true } },
};

async function resolveProduct(tx, line) {
  const value = line.productId || line.productCode;
  const product = await tx.product.findFirst({ where: line.productId ? { id: line.productId } : { code: String(value || "").trim().toUpperCase() } });
  if (!product) throw new Error(`Product not found: ${value}`);
  return product;
}

async function resolveLocation(tx, value, label) {
  if (!value) return null;
  const location = await tx.location.findFirst({ where: { OR: [{ id: value }, { code: value }, { name: value }] } });
  if (!location) throw new Error(`${label} location not found: ${value}`);
  return location;
}

async function resolveCustomer(tx, value) {
  if (!value) return null;
  const customer = await tx.customer.findFirst({ where: { OR: [{ id: value }, { code: value }] } });
  if (!customer) throw new Error(`Customer not found: ${value}`);
  return customer;
}

async function incrementStock(tx, productId, locationId, serialNo, qty) {
  const serial = serialNo || "";
  return tx.inventoryItem.upsert({
    where: { productId_locationId_serialNo: { productId, locationId, serialNo: serial } },
    create: { productId, locationId, serialNo: serial, qty },
    update: { qty: { increment: qty } },
  });
}

async function decrementStock(tx, productId, locationId, serialNo, qty) {
  const serial = serialNo || "";
  const stock = await tx.inventoryItem.findUnique({ where: { productId_locationId_serialNo: { productId, locationId, serialNo: serial } } });
  if (!stock || stock.qty < qty) throw new Error(`Insufficient stock. Available: ${stock?.qty || 0}`);
  return tx.inventoryItem.update({ where: { id: stock.id }, data: { qty: { decrement: qty } } });
}

exports.createMovement = async (payload, userId) => {
  const type = normalizeMovementType(payload.type);
  if (!["INBOUND", "OUTBOUND", "STOCKTRANSFER"].includes(type)) throw new Error("Invalid transaction type");
  const lines = Array.isArray(payload.lines) && payload.lines.length ? payload.lines : [payload];

  return prisma.$transaction(async (tx) => {
    const firstLine = lines[0] || {};
    const fromLocation = await resolveLocation(tx, payload.fromLocationId || payload.fromLocation || firstLine.fromLocationId || firstLine.fromLocation, "From");
    const toLocation = await resolveLocation(tx, payload.toLocationId || payload.toLocation || firstLine.toLocationId || firstLine.toLocation, "To");
    const customer = await resolveCustomer(tx, payload.customerId || payload.customerCode || firstLine.customerId || firstLine.customerCode);

    if (type === "INBOUND" && !toLocation) throw new Error("To location is required for inward stock");
    if (type === "OUTBOUND" && !fromLocation) throw new Error("From location is required for outward stock");
    if (type === "STOCKTRANSFER" && (!fromLocation || !toLocation)) throw new Error("Both locations are required for stock transfer");
    if (type === "STOCKTRANSFER" && fromLocation.id === toLocation.id) throw new Error("From and to locations must be different");

    const transaction = await tx.inventoryTransaction.create({
      data: {
        referenceNo: payload.referenceNo || createReferenceNo(type === "INBOUND" ? "IN" : type === "OUTBOUND" ? "OUT" : "TRF"),
        type,
        customerId: customer?.id,
        fromLocationId: fromLocation?.id,
        toLocationId: toLocation?.id,
        note: payload.note || undefined,
        createdById: userId,
      },
    });

    for (const line of lines) {
      const product = await resolveProduct(tx, line);
      const qty = Number(line.qty || 0);
      if (!qty || qty <= 0) throw new Error("Quantity must be greater than zero");
      const serialNo = String(line.serialNo || "").trim();

      if (type === "INBOUND") await incrementStock(tx, product.id, toLocation.id, serialNo, qty);
      if (type === "OUTBOUND") await decrementStock(tx, product.id, fromLocation.id, serialNo, qty);
      if (type === "STOCKTRANSFER") {
        await decrementStock(tx, product.id, fromLocation.id, serialNo, qty);
        await incrementStock(tx, product.id, toLocation.id, serialNo, qty);
      }

      await tx.inventoryTransactionLine.create({ data: { transactionId: transaction.id, productId: product.id, serialNo, qty, note: line.note || undefined } });
    }

    return tx.inventoryTransaction.findUnique({ where: { id: transaction.id }, include: includeTransaction });
  });
};

exports.getTransactions = async ({ search, type, productCode, customerId, page, limit, skip }) => {
  const where = {
    ...(type ? { type } : {}),
    ...(customerId ? { customerId } : {}),
    ...(productCode ? { lines: { some: { product: { code: productCode } } } } : {}),
    ...(search ? { OR: [{ referenceNo: { contains: search } }, { note: { contains: search } }, { customer: { name: { contains: search } } }, { lines: { some: { product: { code: { contains: search } } } } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: includeTransaction }),
    prisma.inventoryTransaction.count({ where }),
  ]);
  return { items, total };
};

exports.getTransactionById = async (id) => prisma.inventoryTransaction.findUnique({ where: { id }, include: includeTransaction });

exports.parseTransactionExcel = (filePath) => readExcelRows(filePath).map((row) => ({
  type: normalizeMovementType(readCell(row, ["type", "movement", "transactionType"])),
  productCode: readCell(row, ["productCode", "product", "sku", "itemCode"]).toUpperCase(),
  serialNo: readCell(row, ["serialNo", "serial", "serialNumber", "imei"]),
  qty: Number(readCell(row, ["qty", "quantity"]) || 1),
  fromLocation: readCell(row, ["fromLocation", "from", "source"]),
  toLocation: readCell(row, ["toLocation", "to", "destination"]),
  customerCode: readCell(row, ["customerCode", "customer"]).toUpperCase(),
  note: readCell(row, ["note", "remarks"]),
})).filter((row) => row.productCode && row.qty > 0);

exports.transactionTemplateBuffer = () => workbookBuffer([
  { type: "INBOUND", productCode: "PRD001", serialNo: "SN-NEW-001", qty: 1, fromLocation: "", toLocation: "MAIN", customerCode: "", note: "Sample inward" },
  { type: "OUTBOUND", productCode: "PRD002", serialNo: "", qty: 5, fromLocation: "MAIN", toLocation: "", customerCode: "CUS002", note: "Sample outward" },
  { type: "STOCKTRANSFER", productCode: "PRD001", serialNo: "SN-1001", qty: 1, fromLocation: "MAIN", toLocation: "VAN", customerCode: "", note: "Sample transfer" },
], "Inventory Upload");
