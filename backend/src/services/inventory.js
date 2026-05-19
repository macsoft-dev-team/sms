const { prisma } = require("../prisma/client");

exports.getInventory = async ({
  search,
  productCode,
  customerCode,
  locationId,
  stockLevel,
  page,
  limit,
  skip,
}) => {
  const where = {
    ...(locationId ? { locationId } : {}),
    ...(productCode ? { product: { code: productCode } } : {}),
    ...(customerCode ? { product: { customer: { code: customerCode } } } : {}),
    ...(stockLevel === "low" ? { qty: { lt: 5 } } : {}),
    ...(stockLevel === "high" ? { qty: { gte: 5 } } : {}),
    ...(search
      ? {
        OR: [
          { serialNo: { contains: search } },
          { product: { code: { contains: search } } },
          { product: { name: { contains: search } } },
          { product: { customer: { name: { contains: search } } } },
          { location: { name: { contains: search } } },
        ],
      }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.inventoryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        product: { include: { customer: true } },
        location: true,
      },
    }),
    prisma.inventoryItem.count({ where }),
  ]);

  return { items, total };
};

exports.getSummary = async () => {
  const [totalQty, lowStockLines, productCount, locationCount, transactionCount] = await Promise.all([
    prisma.inventoryItem.aggregate({ _sum: { qty: true } }),
    prisma.inventoryItem.count({ where: { qty: { lt: 5 } } }),
    prisma.product.count(),
    prisma.location.count(),
    prisma.inventoryTransaction.count(),
  ]);
  return { totalQty: totalQty._sum.qty || 0, lowStockLines, productCount, locationCount, transactionCount };
};
