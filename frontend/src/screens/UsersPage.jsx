import { useEffect, useState } from "react";
import { Edit, FileSpreadsheet, Plus, Users } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import Select from "../components/ui/Select";
import UserModal from "../components/forms/UserModal";
import MasterExcelModal from "../components/master/MasterExcelModal";
import { roleLabel } from "../constants/rbac";
import { useUsers } from "../hooks/useUsers";
import { downloadMasterSample, parseMasterExcel } from "../utils/masterExcel";

export default function UsersPage({ notify }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { items, meta, status, fetchUsers, createUser, updateUser } = useUsers();
  useEffect(() => { fetchUsers({ search, role }); }, []);
  useEffect(() => { const timer = setTimeout(() => fetchUsers({ search, role }), 350); return () => clearTimeout(timer); }, [search, role]);
  const submit = async (form) => { try { const payload = { ...form, code: form.code || undefined, phone: form.phone || undefined };
    if (editing) await updateUser(editing.id, payload); else await createUser(payload); notify(editing ? "User updated." : "User created."); setModalOpen(false); setEditing(null); fetchUsers({ search, role }); } catch (error) { notify(error.message, "red"); } };

  const uploadUsers = async (file) => {
    try {
      const rows = await parseMasterExcel(file, "users");
      let success = 0;
      for (const row of rows) { await createUser({ ...row, code: row.code || undefined, phone: row.phone || undefined }); success += 1; }
      notify(`${success} user(s) uploaded.`);
      setExcelOpen(false);
      fetchUsers({ search, role });
    } catch (error) { notify(error.message, "red"); }
  };

  const columns = [
    { key: "name", header: "Name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (row) => <Badge tone={row.role === "ADMIN" || row.role === "SUPER_ADMIN" ? "blue" : "slate"}>{roleLabel[row.role] || row.role}</Badge> },
    { key: "active", header: "Status", render: (row) => <Badge tone={row.active ? "green" : "red"}>{row.active ? "Active" : "Inactive"}</Badge> },
    { key: "actions", header: "Actions", render: (row) => <Button variant="ghost" onClick={() => { setEditing(row); setModalOpen(true); }}><Edit size={15} /> Edit</Button> },
  ];
  return <div className="space-y-4"><PageHeader icon={Users} title="Users & RBAC" subtitle="API connected users and roles." actions={<><Button variant="secondary" onClick={() => setExcelOpen(true)}><FileSpreadsheet size={16} /> Excel Upload</Button><Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Add User</Button></>} /><Card><div className="grid gap-3 md:grid-cols-[1fr_220px]"><SearchInput value={search} onChange={setSearch} placeholder="Search users" /><Select value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option value="SUPER_ADMIN">Super Admin</option><option value="ADMIN">Admin</option><option value="OPERATIONS">Operations</option><option value="USER">User</option></Select></div></Card><Card><DataTable columns={columns} data={items} meta={meta} loading={status === "loading"} onPageChange={(page) => fetchUsers({ search, role, page })} onLimitChange={(limit) => fetchUsers({ search, role, limit, page: 1 })} /></Card><UserModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} user={editing} onSubmit={submit} /><MasterExcelModal open={excelOpen} onClose={() => setExcelOpen(false)} title="Upload Users" subtitle="Columns: code, name, email, phone, role, password, active." onDownloadSample={() => downloadMasterSample("users")} onUpload={uploadUsers} /></div>;
}
