const { prisma } = require("../prisma/client");

exports.createManufacturer = async (data) => prisma.manufacturer.create({ data });
exports.getManufacturers = async ({ search, page, limit, skip }) => {
  const where = search ? { OR: [{ code: { contains: search } }, { name: { contains: search } }] } : {};
  const [items, total] = await Promise.all([
    prisma.manufacturer.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" }, include: { _count: { select: { products: true } } } }),
    prisma.manufacturer.count({ where }),
  ]);
  return { items, total };
};
exports.getManufacturerById = async (id) => prisma.manufacturer.findUnique({ where: { id }, include: { products: true } });
exports.updateManufacturer = async (id, data) => prisma.manufacturer.update({ where: { id }, data });
