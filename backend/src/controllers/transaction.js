const fs = require("fs");
const service = require("../services/transaction");
const asyncHandler = require("../utils/asyncHandler");
const { created, success } = require("../utils/apiResponse");
const { getPagination, getMeta } = require("../utils/pagination");
const { emitInventoryChanged } = require("../socket");

exports.createMovement = asyncHandler(async (req, res) => {
  const transaction = await service.createMovement(req.body, req.user.id);
  emitInventoryChanged(req.io, { transactionId: transaction.id, referenceNo: transaction.referenceNo, type: transaction.type });
  return created(res, transaction, "Inventory movement created");
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { items, total } = await service.getTransactions({ ...req.query, page, limit, skip });
  return success(res, items, "Transactions fetched", 200, getMeta(total, page, limit));
});

exports.getTransactionById = asyncHandler(async (req, res) => {
  const item = await service.getTransactionById(req.params.id);
  if (!item) return res.status(404).json({ message: "Transaction not found" });
  return success(res, item);
});

exports.uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Excel file is required" });
  const rows = service.parseTransactionExcel(req.file.path);
  const accepted = [];
  const errors = [];
  for (let index = 0; index < rows.length; index += 1) {
    try {
      const transaction = await service.createMovement(rows[index], req.user.id);
      accepted.push(transaction);
      emitInventoryChanged(req.io, { transactionId: transaction.id, referenceNo: transaction.referenceNo, type: transaction.type });
    } catch (error) {
      errors.push({ row: index + 2, message: error.message });
    }
  }
  fs.unlink(req.file.path, () => {});
  return success(res, { accepted, errors }, "Excel import processed");
});

exports.downloadTemplate = asyncHandler(async (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=inventory-upload-template.xlsx");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  return res.send(service.transactionTemplateBuffer());
});
