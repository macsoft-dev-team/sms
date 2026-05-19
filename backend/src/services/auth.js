const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/client");
const env = require("../config/env");
const { comparePassword, hashPassword } = require("../utils/password");

const publicUserSelect = {
  id: true, code: true, name: true, email: true, phone: true, role: true, active: true, createdAt: true, updatedAt: true,
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email: String(email || "").trim().toLowerCase() } });
  if (!user || !user.active) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const safeUser = await prisma.user.findUnique({ where: { id: user.id }, select: publicUserSelect });
  return { token, user: safeUser };
};

exports.me = async (id) => prisma.user.findUnique({ where: { id }, select: publicUserSelect });

exports.updateProfile = async (id, data) => {
  const updateData = { name: data.name, email: data.email, phone: data.phone };
  Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);
  if (data.password) updateData.password = await hashPassword(data.password);
  return prisma.user.update({ where: { id }, data: updateData, select: publicUserSelect });
};
