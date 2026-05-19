const { prisma } = require("../prisma/client");
const { readCell, readExcelRows, workbookBuffer } = require("../utils/excel");

exports.createCustomer = async (data) => prisma.customer.create({
  data: {
    code: data.code,
    name: data.name,
    company: data.company || undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    address: data.address || undefined,
    groupName: data.groupName || undefined,
    tier: data.tier || undefined,
    status: data.status || "ACTIVE",
  },
});

exports.getCustomers = async ({ search, groupName, page, limit, skip }) => {
  const where = {
    ...(groupName ? { groupName } : {}),
    ...(search ? { OR: [{ code: { contains: search } }, { name: { contains: search } }, { company: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }, { groupName: { contains: search } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { _count: { select: { transactions: true } } } }),
    prisma.customer.count({ where }),
  ]);
  return { items, total };
};

exports.getCustomerById = async (id) => prisma.customer.findUnique({ where: { id }, include: { transactions: true } });
exports.updateCustomer = async (id, data) => prisma.customer.update({ where: { id }, data });

exports.parseCustomersExcel = (filePath) => readExcelRows(filePath).map((row) => ({
  code: readCell(row, ["code", "customerCode"]),
  name: readCell(row, ["name", "customerName"]),
  company: readCell(row, ["company", "companyName"]),
  email: readCell(row, ["email"]),
  phone: readCell(row, ["phone", "mobile"]),
  address: readCell(row, ["address"]),
  groupName: readCell(row, ["groupName", "group"]),
  tier: readCell(row, ["tier"]),
  status: readCell(row, ["status"]) || "ACTIVE",
})).filter((row) => row.code && row.name);

exports.createCustomersFromRows = async (rows) => {
  const accepted = [];
  const errors = [];
  for (let index = 0; index < rows.length; index += 1) {
    try {
      accepted.push(await exports.createCustomer(rows[index]));
    } catch (error) {
      errors.push({ row: index + 2, message: error.message });
    }
  }
  return { accepted, errors };
};

exports.customersTemplateBuffer = () => workbookBuffer([
  { code: "CUS1001", name: "North Star Retail", company: "North Star Pvt Ltd", email: "ops@northstar.local", phone: "+91 90000 10001", address: "Chennai", groupName: "Retail", tier: "Gold", status: "ACTIVE" },
  { code: "CUS1002", name: "Metro Services", company: "Metro Services", email: "service@metro.local", phone: "+91 90000 10002", address: "Bengaluru", groupName: "Service", tier: "Silver", status: "ACTIVE" },
], "Customers");
