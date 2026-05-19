import { useEffect, useMemo, useState } from "react";
import { Edit, FileSpreadsheet, Plus, ShoppingBag, UsersRound, Warehouse } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import CustomerModal from "../components/forms/CustomerModal";
import MasterExcelModal from "../components/master/MasterExcelModal";
import { useCustomers } from "../hooks/useCustomers";
import { downloadMasterSample, parseMasterExcel } from "../utils/masterExcel";

export default function Customers({ notify, goInventory }) {
  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { items, meta, status, fetchCustomers, createCustomer, updateCustomer } = useCustomers();
  const grouped = useMemo(() => items.reduce((acc, c) => { const key = c.groupName || "Ungrouped"; acc[key] = acc[key] || []; acc[key].push(c); return acc; }, {}), [items]);

  useEffect(() => { fetchCustomers({ search }); }, []);
  useEffect(() => { const timer = setTimeout(() => fetchCustomers({ search }), 350); return () => clearTimeout(timer); }, [search]);
  const submit = async (form) => { try { if (editing) await updateCustomer(editing.id, form); else await createCustomer(form); notify(editing ? "Customer updated." : "Customer created."); setModalOpen(false); setEditing(null); fetchCustomers({ search }); } catch (error) { notify(error.message, "red"); } };

  const uploadCustomers = async (file) => {
    try {
      const rows = await parseMasterExcel(file, "customers");
      let success = 0;
      for (const row of rows) { await createCustomer(row); success += 1; }
      notify(`${success} customer(s) uploaded.`);
      setExcelOpen(false);
      fetchCustomers({ search });
    } catch (error) { notify(error.message, "red"); }
  };

  const columns = [
    { key: "code", header: "Code", render: (row) => <span className="font-bold text-slate-900">{row.code}</span> },
    { key: "name", header: "Name" },
    { key: "groupName", header: "Group", render: (row) => <Badge tone="purple">{row.groupName || "Ungrouped"}</Badge> },
    { key: "phone", header: "Phone", render: (row) => row.phone || "-" },
    { key: "email", header: "Email", render: (row) => row.email || "-" },
    { key: "actions", header: "Actions", render: (row) => <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => goInventory({ customerCode: row.code })}><Warehouse size={15} /> Inventory</Button><Button variant="ghost" onClick={() => { setEditing(row); setModalOpen(true); }}><Edit size={15} /> Edit</Button></div> },
  ];
  return <div className="space-y-4"><PageHeader icon={ShoppingBag} title="Customers" subtitle="API connected customers with grouping." actions={<><Button variant="secondary" onClick={() => setExcelOpen(true)}><FileSpreadsheet size={16} /> Excel Upload</Button><Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={16} /> Add Customer</Button></>} /><Card><div className="grid gap-3 md:grid-cols-[1fr_auto]"><SearchInput value={search} onChange={setSearch} placeholder="Search customers" /><Button variant={groupBy ? "primary" : "secondary"} onClick={() => setGroupBy((v) => !v)}><UsersRound size={16} /> Group</Button></div></Card>{groupBy ? Object.entries(grouped).map(([group, rows]) => <Card key={group}><h3 className="mb-3 text-base font-bold text-slate-950">{group}</h3><DataTable columns={columns} data={rows} loading={status === "loading"} /></Card>) : <Card><DataTable columns={columns} data={items} meta={meta} loading={status === "loading"} onPageChange={(page) => fetchCustomers({ search, page })} onLimitChange={(limit) => fetchCustomers({ search, limit, page: 1 })} /></Card>}<CustomerModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} customer={editing} onSubmit={submit} /><MasterExcelModal open={excelOpen} onClose={() => setExcelOpen(false)} title="Upload Customers" subtitle="Columns: code, name, company, email, phone, address, groupName, tier, status." onDownloadSample={() => downloadMasterSample("customers")} onUpload={uploadCustomers} /></div>;
}
