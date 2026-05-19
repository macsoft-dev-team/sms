const fs = require("fs");
const path = require("path");
const multer = require("multer");
const env = require("../config/env");

const uploadDir = path.join(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
});

const uploader = multer({ storage });

module.exports = {
  single: (fieldName) => uploader.single(fieldName),
  array: (fieldName, maxCount) => uploader.array(fieldName, maxCount),
  fields: (fields) => uploader.fields(fields),
};
