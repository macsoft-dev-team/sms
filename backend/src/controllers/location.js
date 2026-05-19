const service = require("../services/location");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.createLocation = asyncHandler(async (req, res) => created(res, await service.createLocation(req.body), "Location created"));
exports.getLocations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getLocations({ ...req.query, page, limit, skip });
  return success(res, items, "Locations fetched", 200, getMeta(total, page, limit));
});
exports.getLocationById = asyncHandler(async (req, res) => {
  const item = await service.getLocationById(req.params.id);
  if (!item) return res.status(404).json({ message: "Location not found" });
  return success(res, item);
});
exports.updateLocation = asyncHandler(async (req, res) => success(res, await service.updateLocation(req.params.id, req.body), "Location updated"));
