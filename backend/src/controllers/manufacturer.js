const service = require("../services/manufacturer");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.createManufacturer = asyncHandler(async (req, res) => created(res, await service.createManufacturer(req.body), "Manufacturer created"));
exports.getManufacturers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getManufacturers({ ...req.query, page, limit, skip });
  return success(res, items, "Manufacturers fetched", 200, getMeta(total, page, limit));
});
exports.getManufacturerById = asyncHandler(async (req, res) => {
  const item = await service.getManufacturerById(req.params.id);
  if (!item) return res.status(404).json({ message: "Manufacturer not found" });
  return success(res, item);
});
exports.updateManufacturer = asyncHandler(async (req, res) => success(res, await service.updateManufacturer(req.params.id, req.body), "Manufacturer updated"));
