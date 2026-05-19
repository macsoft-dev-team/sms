import * as XLSX from "xlsx";

const samples = {
  customers: [
    { code: "CUS1001", name: "North Star Retail", company: "North Star Pvt Ltd", email: "ops@northstar.local", phone: "+91 90000 10001", address: "Chennai", groupName: "Retail", tier: "Gold", status: "ACTIVE" },
    { code: "CUS1002", name: "Metro Services", company: "Metro Services", email: "service@metro.local", phone: "+91 90000 10002", address: "Bengaluru", groupName: "Service", tier: "Silver", status: "ACTIVE" },
  ],
  products: [
    { code: "PRD1001", name: "Handheld Scanner", customerCode: "CUS001", unit: "Nos", serialTracking: "TRUE", status: "ACTIVE", description: "Sample serialized product" },
    { code: "PRD1002", name: "Thermal Label", customerCode: "CUS002", unit: "Roll", serialTracking: "FALSE", status: "ACTIVE", description: "Sample non-serialized product" },
  ],
  users: [
    { code: "USR1001", name: "Warehouse Operator", email: "operator1@app.local", phone: "+91 90000 20001", role: "OPERATIONS", password: "User@123", active: "TRUE" },
    { code: "USR1002", name: "Inventory Admin", email: "inventory.admin@app.local", phone: "+91 90000 20002", role: "ADMIN", password: "Admin@123", active: "TRUE" },
  ],
};

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

export function downloadMasterSample(type) {
  const rows = samples[type] || [];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, type);
  XLSX.writeFile(workbook, `${type}-sample-upload.xlsx`);
}

export async function parseMasterExcel(file, type, context = {}) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  if (type === "customers") {
    return rows.map((row) => ({
      code: readCell(row, ["code", "customerCode"]),
      name: readCell(row, ["name", "customerName"]),
      company: readCell(row, ["company", "companyName"]),
      email: readCell(row, ["email"]),
      phone: readCell(row, ["phone", "mobile"]),
      address: readCell(row, ["address"]),
      groupName: readCell(row, ["groupName", "group"]),
      tier: readCell(row, ["tier"]),
      status: readCell(row, ["status"]) || "ACTIVE",
    })).filter((row) => row.code && row.name);
  }

  if (type === "products") {
    return rows.map((row) => {
      const customerCode = readCell(row, ["customerCode", "customer", "customerName"]);
      const customer = context.customers?.find((item) =>
        [item.code, item.name, item.id]
          .filter(Boolean)
          .map(String)
          .map((value) => value.toLowerCase())
          .includes(String(customerCode).toLowerCase())
      );

      return {
        code: readCell(row, ["code", "productCode", "sku"]),
        name: readCell(row, ["name", "productName"]),
        customerId: customer?.id,
        unit: readCell(row, ["unit", "uom"]) || "Nos",
        serialTracking: toBool(readCell(row, ["serialTracking", "serial", "isSerialized"]), false),
        status: readCell(row, ["status"]) || "ACTIVE",
        description: readCell(row, ["description", "remarks"]),
      };
    }).filter((row) => row.code && row.name && row.customerId);
  }

  if (type === "users") {
    return rows.map((row) => ({
      code: readCell(row, ["code", "userCode"]),
      name: readCell(row, ["name", "userName"]),
      email: readCell(row, ["email"]),
      phone: readCell(row, ["phone", "mobile"]),
      role: readCell(row, ["role"]) || "OPERATIONS",
      password: readCell(row, ["password"]),
      active: toBool(readCell(row, ["active", "status"]), true),
    })).filter((row) => row.name && row.email && row.password);
  }

  return [];
}
