const { prisma } = require("../prisma/client");
const { hashPassword } = require("../utils/password");
const { readCell, toBool, readExcelRows, workbookBuffer } = require("../utils/excel");

const publicUserSelect = { id: true, code: true, name: true, email: true, phone: true, role: true, active: true, createdAt: true, updatedAt: true };

exports.createUser = async (data) => {
  if (!data.password) throw new Error("Password is required");
  return prisma.user.create({
    data: {
      code: data.code || undefined,
      name: data.name,
      email: String(data.email || "").trim().toLowerCase(),
      phone: data.phone || undefined,
      role: data.role || "USER",
      active: data.active ?? true,
      password: await hashPassword(data.password),
    },
    select: publicUserSelect,
  });
};

exports.getUsers = async ({ search, role, page, limit, skip }) => {
  const where = {
    ...(role ? { role } : {}),
    ...(search ? { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }, { code: { contains: search } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, select: publicUserSelect }),
    prisma.user.count({ where }),
  ]);
  return { items, total };
};

exports.getUserById = async (id) => prisma.user.findUnique({ where: { id }, select: publicUserSelect });

exports.updateUser = async (id, data) => {
  const updateData = { code: data.code || undefined, name: data.name, email: data.email, phone: data.phone || undefined, role: data.role, active: data.active };
  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
  if (data.password) updateData.password = await hashPassword(data.password);
  return prisma.user.update({ where: { id }, data: updateData, select: publicUserSelect });
};

exports.parseUsersExcel = async (filePath) => {
  return readExcelRows(filePath).map((row) => ({
    code: readCell(row, ["code", "userCode"]),
    name: readCell(row, ["name", "userName"]),
    email: readCell(row, ["email"]),
    phone: readCell(row, ["phone", "mobile"]),
    role: readCell(row, ["role"]) || "OPERATIONS",
    password: readCell(row, ["password"]),
    active: toBool(readCell(row, ["active", "status"]), true),
  })).filter((row) => row.name && row.email && row.password);
};

exports.createUsersFromRows = async (rows) => {
  const accepted = [];
  const errors = [];
  for (let index = 0; index < rows.length; index += 1) {
    try {
      accepted.push(await exports.createUser(rows[index]));
    } catch (error) {
      errors.push({ row: index + 2, message: error.message });
    }
  }
  return { accepted, errors };
};

exports.usersTemplateBuffer = () => workbookBuffer([
  { code: "USR1001", name: "Warehouse Operator", email: "operator1@app.local", phone: "+91 90000 20001", role: "OPERATIONS", password: "User@123", active: "TRUE" },
  { code: "USR1002", name: "Inventory Admin", email: "inventory.admin@app.local", phone: "+91 90000 20002", role: "ADMIN", password: "Admin@123", active: "TRUE" },
], "Users");
