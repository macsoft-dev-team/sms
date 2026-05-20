const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../../generated/prisma/client");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });

// Initialize the Postgres adapter
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
});
// Instantiate the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };