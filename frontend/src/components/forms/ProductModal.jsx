import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

const empty = {
  code: "",
  name: "",
  customerId: "",
  unit: "Nos",
  serialTracking: false,
  status: "ACTIVE",
  description: "",
};

export default function ProductModal({ open, onClose, product, customers, onSubmit }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (product) {
      setForm({
        code: product.code || "",
        name: product.name || "",
        customerId: product.customerId || product.customer?.id || "",
        unit: product.unit || "Nos",
        serialTracking: Boolean(product.serialTracking),
        status: product.status || "ACTIVE",
        description: product.description || "",
      });
    } else {
      setForm({ ...empty, customerId: customers[0]?.id || "" });
    }
  }, [product, customers, open]);

  return (
    <Modal open={open} onClose={onClose} title={product ? "Update Product" : "Add Product"} size="lg">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(form);
        }}
        className="grid gap-3 md:grid-cols-2"
      >
        <Input
          label="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          required
        />

        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <Select
          label="Customer"
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: e.target.value })}
          required
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.code} - {customer.name}
            </option>
          ))}
        </Select>

        <Input
          label="Unit"
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
        />

        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>

        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={form.serialTracking}
            onChange={(e) => setForm({ ...form, serialTracking: e.target.checked })}
          />
          Serial tracking
        </label>

        <div className="md:col-span-2">
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 md:col-span-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button>{product ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}