import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

const empty = { code: "", name: "", company: "", email: "", phone: "", address: "", groupName: "", tier: "", status: "ACTIVE" };

export default function CustomerModal({ open, onClose, customer, onSubmit }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(customer ? { ...empty, ...customer } : empty); }, [customer, open]);
  return (
    <Modal open={open} onClose={onClose} title={customer ? "Update Customer" : "Add Customer"} size="lg">
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(form); }} className="grid gap-3 md:grid-cols-2">
        <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Company" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <Input label="Group" value={form.groupName || ""} onChange={(e) => setForm({ ...form, groupName: e.target.value })} />
        <Input label="Email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Tier" value={form.tier || ""} onChange={(e) => setForm({ ...form, tier: e.target.value })} />
        <Select label="Status" value={form.status || "ACTIVE"} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></Select>
        <div className="flex justify-end gap-2 md:col-span-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button>{customer ? "Update" : "Create"}</Button></div>
      </form>
    </Modal>
  );
}
