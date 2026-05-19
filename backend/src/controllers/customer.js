const fs = require("fs");
const service = require("../services/customer");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.createCustomer = asyncHandler(async (req, res) => created(res, await service.createCustomer(req.body), "Customer created"));
exports.getCustomers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getCustomers({ ...req.query, page, limit, skip });
  return success(res, items, "Customers fetched", 200, getMeta(total, page, limit));
});
exports.getCustomerById = asyncHandler(async (req, res) => {
  const item = await service.getCustomerById(req.params.id);
  if (!item) return res.status(404).json({ message: "Customer not found" });
  return success(res, item);
});
exports.updateCustomer = asyncHandler(async (req, res) => success(res, await service.updateCustomer(req.params.id, req.body), "Customer updated"));
exports.downloadTemplate = asyncHandler(async (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=customers-sample-upload.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(service.customersTemplateBuffer());
});
exports.uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Excel file is required" });
  const rows = service.parseCustomersExcel(req.file.path);
  const result = await service.createCustomersFromRows(rows);
  fs.unlink(req.file.path, () => {});
  return success(res, result, "Customers upload processed");
});
