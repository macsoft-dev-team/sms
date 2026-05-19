const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.env === "development") app.use(morgan("dev"));

app.use((req, res, next) => {
  req.io = app.get("io");
  next();
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "inventory-backend-full" }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
