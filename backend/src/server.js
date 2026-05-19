const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { prisma } = require("./prisma/client");
const { setupSocket } = require("./socket");

const server = http.createServer(app);
const io = setupSocket(server);
app.set("io", io);

server.listen(env.port, () => {
  console.log(`Inventory backend running on http://localhost:${env.port}`);
});

async function shutdown() {
  console.log("Shutting down...");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
