const fs = require("fs");
const service = require("../services/user");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.createUser = asyncHandler(async (req, res) => created(res, await service.createUser(req.body), "User created"));
exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getUsers({ ...req.query, page, limit, skip });
  return success(res, items, "Users fetched", 200, getMeta(total, page, limit));
});
exports.getUserById = asyncHandler(async (req, res) => {
  const item = await service.getUserById(req.params.id);
  if (!item) return res.status(404).json({ message: "User not found" });
  return success(res, item);
});
exports.updateUser = asyncHandler(async (req, res) => success(res, await service.updateUser(req.params.id, req.body), "User updated"));
exports.downloadTemplate = asyncHandler(async (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=users-sample-upload.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(service.usersTemplateBuffer());
});
exports.uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Excel file is required" });
  const rows = await service.parseUsersExcel(req.file.path);
  const result = await service.createUsersFromRows(rows);
  fs.unlink(req.file.path, () => {});
  return success(res, result, "Users upload processed");
});
