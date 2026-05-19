const { prisma } = require("../prisma/client");
const { readCell, toBool, readExcelRows, workbookBuffer } = require("../utils/excel");

exports.createProduct = async (data) => {
  if (!data.customerId) throw new Error("Customer is required for product creation");

  return prisma.product.create({
    data: {
      code: data.code,
      name: data.name,
      customerId: data.customerId,
      unit: data.unit || "Nos",
      serialTracking: data.serialTracking ?? false,
      status: data.status || "ACTIVE",
      description: data.description || undefined,
    },
    include: { customer: true },
  });
};

exports.getProducts = async ({ search, customerId, status, page, limit, skip }) => {
  const where = {
    ...(customerId ? { customerId } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
        OR: [
          { code: { contains: search } },
          { name: { contains: search } },
          { customer: { name: { contains: search } } },
          { customer: { code: { contains: search } } },
        ],
      }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        _count: { select: { inventoryItems: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
};

exports.getProductById = async (id) =>
  prisma.product.findUnique({
    where: { id },
    include: {
      customer: true,
      inventoryItems: { include: { location: true } },
    },
  });

exports.updateProduct = async (id, data) => {
  const updateData = {
    code: data.code,
    name: data.name,
    customerId: data.customerId,
    unit: data.unit,
    serialTracking: data.serialTracking,
    status: data.status,
    description: data.description,
  };

  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined || updateData[key] === "") delete updateData[key];
  });

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: { customer: true },
  });
};

exports.parseProductsExcel = async (filePath) => {
  const customers = await prisma.customer.findMany();

  return readExcelRows(filePath)
    .map((row) => {
      const customerValue = readCell(row, [
        "customerCode",
        "customer",
        "customerName",
      ]);

      const customer = customers.find((item) =>
        [item.id, item.code, item.name]
          .filter(Boolean)
          .map((value) => String(value).toLowerCase())
          .includes(String(customerValue).toLowerCase())
      );

      return {
        code: readCell(row, ["code", "productCode", "sku"]),
        name: readCell(row, ["name", "productName"]),
        customerId: customer?.id,
        unit: readCell(row, ["unit", "uom"]) || "Nos",
        serialTracking: toBool(
          readCell(row, ["serialTracking", "serial", "isSerialized"]),
          false
        ),
        status: readCell(row, ["status"]) || "ACTIVE",
        description: readCell(row, ["description", "remarks"]),
      };
    })
    .filter((row) => row.code && row.name && row.customerId);
};

exports.createProductsFromRows = async (rows) => {
  const accepted = [];
  const errors = [];

  for (let index = 0; index < rows.length; index += 1) {
    try {
      accepted.push(await exports.createProduct(rows[index]));
    } catch (error) {
      errors.push({ row: index + 2, message: error.message });
    }
  }

  return { accepted, errors };
};

exports.productsTemplateBuffer = () =>
  workbookBuffer(
    [
      {
        code: "PRD1001",
        name: "Handheld Scanner",
        customerCode: "CUS001",
        unit: "Nos",
        serialTracking: "TRUE",
        status: "ACTIVE",
        description: "Sample serialized product",
      },
      {
        code: "PRD1002",
        name: "Thermal Label",
        customerCode: "CUS002",
        unit: "Roll",
        serialTracking: "FALSE",
        status: "ACTIVE",
        description: "Sample non-serialized product",
      },
    ],
    "Products"
  );