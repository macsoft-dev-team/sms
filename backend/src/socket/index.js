const { Server } = require("socket.io");
const env = require("../config/env");

function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { socketId: socket.id });
    socket.on("join:inventory", () => socket.join("inventory"));
  });

  return io;
}

function emitInventoryChanged(io, payload) {
  if (!io) return;
  io.to("inventory").emit("inventory:changed", payload);
  io.emit("transaction:created", payload);
}

module.exports = { setupSocket, emitInventoryChanged };
