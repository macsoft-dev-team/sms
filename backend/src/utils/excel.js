const XLSX = require("xlsx");

function normalizeKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function readCell(row, aliases) {
  const map = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizeKey(key), value]));
  for (const alias of aliases) {
    const value = map[normalizeKey(alias)];
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
}

function toBool(value, fallback = false) {
  if (value === true || value === false) return value;
  const text = String(value || "").trim().toLowerCase();
  if (["true", "yes", "y", "1", "active"].includes(text)) return true;
  if (["false", "no", "n", "0", "inactive"].includes(text)) return false;
  return fallback;
}

function normalizeMovementType(value) {
  const movement = String(value || "INBOUND").toUpperCase().replace(/[^A-Z]/g, "");
  if (["INWARD", "IN", "PURCHASE", "RECEIVE", "RECEIPT"].includes(movement)) return "INBOUND";
  if (["OUTWARD", "OUT", "SALE", "ISSUE", "DISPATCH"].includes(movement)) return "OUTBOUND";
  if (["TRANSFER", "STOCKTRANSFER", "STOCKMOVE"].includes(movement)) return "STOCKTRANSFER";
  return movement || "INBOUND";
}

function readExcelRows(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function workbookBuffer(rows, sheetName = "Sheet1") {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

module.exports = { readCell, toBool, normalizeMovementType, readExcelRows, workbookBuffer };
