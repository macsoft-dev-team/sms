import { useEffect, useState } from "react";
import { Save, UserCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";

export default function Profile({ notify }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", changePassword: false });
  useEffect(() => { if (user) setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", password: "", changePassword: false }); }, [user]);
  const submit = async (event) => {
    event.preventDefault();
    try { const payload = { name: form.name, email: form.email, phone: form.phone }; if (form.changePassword) payload.password = form.password; await updateProfile(payload); notify("Profile updated."); setForm((prev) => ({ ...prev, password: "", changePassword: false })); } catch (error) { notify(error.message, "red"); }
  };
  return <div className="space-y-4"><PageHeader icon={UserCircle} title="Self Profile" subtitle="Update your profile through the backend API." /><Card className="max-w-2xl"><form onSubmit={submit} className="grid gap-3 md:grid-cols-2"><Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /><Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={form.changePassword} onChange={(e) => setForm({ ...form, changePassword: e.target.checked })} /> Change password</label>{form.changePassword && <Input label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="md:col-span-2" />}<div className="md:col-span-2"><Button><Save size={16} /> Save profile</Button></div></form></Card></div>;
}
