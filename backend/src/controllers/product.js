const fs = require("fs");
const service = require("../services/product");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.createProduct = asyncHandler(async (req, res) => created(res, await service.createProduct(req.body), "Product created"));
exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getProducts({ ...req.query, page, limit, skip });
  return success(res, items, "Products fetched", 200, getMeta(total, page, limit));
});
exports.getProductById = asyncHandler(async (req, res) => {
  const item = await service.getProductById(req.params.id);
  if (!item) return res.status(404).json({ message: "Product not found" });
  return success(res, item);
});
exports.updateProduct = asyncHandler(async (req, res) => success(res, await service.updateProduct(req.params.id, req.body), "Product updated"));
exports.downloadTemplate = asyncHandler(async (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=products-sample-upload.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(service.productsTemplateBuffer());
});
exports.uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Excel file is required" });
  const rows = await service.parseProductsExcel(req.file.path);
  const result = await service.createProductsFromRows(rows);
  fs.unlink(req.file.path, () => {});
  return success(res, result, "Products upload processed");
});
