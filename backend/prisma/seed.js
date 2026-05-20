const bcrypt = require("bcryptjs");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient, UserRole } = require("../generated/prisma");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT || 3306),
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@macsoft.com" },
    update: {
      name: "Admin",
      password: adminPassword,
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      code: "USR001",
      name: "Admin",
      email: "admin@macsoft.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "user@macsoft.com" },
    update: {
      name: "Store User",
      password: userPassword,
      role: UserRole.OPERATIONS,
      active: true,
    },
    create: {
      code: "USR002",
      name: "Store User",
      email: "user@macsoft.com",
      password: userPassword,
      role: UserRole.OPERATIONS,
      active: true,
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { code: "CRI001" },
    update: {
      name: "CRI Pumps",
      groupName: "Retail",
      status: "ACTIVE",
    },
    create: {
      code: "CRI001",
      name: "CRI Pumps",
      groupName: "Retail",
      status: "ACTIVE",
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { code: "KSB001" },
    update: {
      name: "KSB",
      groupName: "B2B",
      phone: "+91 90000 00000",
      status: "ACTIVE",
    },
    create: {
      code: "KSB001",
      name: "KSB",
      groupName: "B2B",
      phone: "+91 90000 00000",
      status: "ACTIVE",
    },
  });

  const mainLocation = await prisma.location.upsert({
    where: { code: "MAIN" },
    update: {
      name: "Main Store",
      type: "STORE",
      active: true,
    },
    create: {
      code: "MAIN",
      name: "Main Store",
      type: "STORE",
      active: true,
    },
  });

  await prisma.location.upsert({
    where: { code: "WH" },
    update: {
      name: "Warehouse",
      type: "WAREHOUSE",
      active: true,
    },
    create: {
      code: "WH",
      name: "Warehouse",
      type: "WAREHOUSE",
      active: true,
    },
  });

  await prisma.location.upsert({
    where: { code: "VAN" },
    update: {
      name: "Service Van",
      type: "MOBILE",
      active: true,
    },
    create: {
      code: "VAN",
      name: "Service Van",
      type: "MOBILE",
      active: true,
    },
  });

  const product1 = await prisma.product.upsert({
    where: { code: "PRD001" },
    update: {
      name: "Barcode Scanner",
      customerId: customer1.id,
      unit: "Nos",
      serialTracking: true,
      status: "ACTIVE",
    },
    create: {
      code: "PRD001",
      name: "Barcode Scanner",
      customerId: customer1.id,
      unit: "Nos",
      serialTracking: true,
      status: "ACTIVE",
    },
  });

  const product2 = await prisma.product.upsert({
    where: { code: "PRD002" },
    update: {
      name: "Thermal Label Roll",
      customerId: customer2.id,
      unit: "Roll",
      serialTracking: false,
      status: "ACTIVE",
    },
    create: {
      code: "PRD002",
      name: "Thermal Label Roll",
      customerId: customer2.id,
      unit: "Roll",
      serialTracking: false,
      status: "ACTIVE",
    },
  });

  await prisma.inventoryItem.upsert({
    where: {
      productId_locationId_serialNo: {
        productId: product1.id,
        locationId: mainLocation.id,
        serialNo: "SN-1001",
      },
    },
    update: {
      qty: 1,
    },
    create: {
      productId: product1.id,
      locationId: mainLocation.id,
      serialNo: "SN-1001",
      qty: 1,
    },
  });

  await prisma.inventoryItem.upsert({
    where: {
      productId_locationId_serialNo: {
        productId: product2.id,
        locationId: mainLocation.id,
        serialNo: "",
      },
    },
    update: {
      qty: 50,
    },
    create: {
      productId: product2.id,
      locationId: mainLocation.id,
      serialNo: "",
      qty: 50,
    },
  });

  console.log("Seed completed", {
    admin: admin.email,
    customers: [customer1.code, customer2.code],
    products: [product1.code, product2.code],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });