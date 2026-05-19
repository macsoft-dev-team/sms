const { prisma } = require("../prisma/client");

exports.createLocation = async (data) => prisma.location.create({ data });
exports.getLocations = async ({ search, page, limit, skip }) => {
  const where = search ? { OR: [{ code: { contains: search } }, { name: { contains: search } }, { type: { contains: search } }] } : {};
  const [items, total] = await Promise.all([
    prisma.location.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.location.count({ where }),
  ]);
  return { items, total };
};
exports.getLocationById = async (id) => prisma.location.findUnique({ where: { id } });
exports.updateLocation = async (id, data) => prisma.location.update({ where: { id }, data });
