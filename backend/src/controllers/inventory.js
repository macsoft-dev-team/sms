const service = require("../services/inventory");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");

exports.getInventory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getInventory({ ...req.query, page, limit, skip });
  return success(res, items, "Inventory fetched", 200, getMeta(total, page, limit));
});
exports.getSummary = asyncHandler(async (req, res) => success(res, await service.getSummary(), "Inventory summary fetched"));
