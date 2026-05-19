const service = require("../services/auth");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/apiResponse");

exports.login = asyncHandler(async (req, res) => success(res, await service.login(req.body), "Login successful"));
exports.me = asyncHandler(async (req, res) => success(res, await service.me(req.user.id), "Profile fetched"));
exports.updateProfile = asyncHandler(async (req, res) => success(res, await service.updateProfile(req.user.id, req.body), "Profile updated"));
