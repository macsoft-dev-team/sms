export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
export const STAFF_ROLES = ["SUPER_ADMIN", "ADMIN", "OPERATIONS"];

export const roleLabel = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  OPERATIONS: "Operations",
  USER: "User",
};

export const transactionTypes = [
  { value: "INBOUND", label: "Inward / Inbound" },
  { value: "OUTBOUND", label: "Outward / Outbound" },
  { value: "STOCKTRANSFER", label: "Stock Transfer" },
];

export const stockLevels = [
  { value: "", label: "All stock" },
  { value: "low", label: "Low stock (< 5)" },
  { value: "high", label: "High stock (>= 5)" },
];
