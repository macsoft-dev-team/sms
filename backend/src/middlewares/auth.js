const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/client");
const env = require("../config/env");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await prisma.user.findFirst({
      where: { id: decoded.id, active: true },
      select: { id: true, code: true, name: true, email: true, phone: true, role: true, active: true },
    });
    if (!user) return res.status(401).json({ message: "User not found for token" });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};
