import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";

const empty = { code: "", name: "", email: "", phone: "", role: "OPERATIONS", password: "", active: true, changePassword: false };

export default function UserModal({ open, onClose, user, onSubmit }) {
  const [form, setForm] = useState(empty);
  useEffect(() => { setForm(user ? { ...empty, ...user, password: "", changePassword: false } : empty); }, [user, open]);
  const submit = (event) => {
    event.preventDefault();
    const payload = { code: form.code, name: form.name, email: form.email, phone: form.phone, role: form.role, active: form.active };
    if (!user || form.changePassword) payload.password = form.password;
    onSubmit(payload);
  };
  return (
    <Modal open={open} onClose={onClose} title={user ? "Update User" : "Add User"} size="lg">
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <Input label="Code" value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="SUPER_ADMIN">Super Admin</option><option value="ADMIN">Admin</option><option value="OPERATIONS">Operations</option><option value="USER">User</option></Select>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
        {user && <label className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600 md:col-span-2"><input type="checkbox" checked={form.changePassword} onChange={(e) => setForm({ ...form, changePassword: e.target.checked })} /> Change password</label>}
        {(!user || form.changePassword) && <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!user || form.changePassword} />}
        <div className="flex justify-end gap-2 md:col-span-2"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button>{user ? "Update" : "Create"}</Button></div>
      </form>
    </Modal>
  );
}
