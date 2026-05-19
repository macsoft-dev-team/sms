import { useEffect, useState } from "react";
import { Boxes, FileSpreadsheet, PackagePlus, X } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import Select from "../components/ui/Select";
import MovementModal from "../components/inventory/MovementModal";
import ExcelUploadModal from "../components/inventory/ExcelUploadModal";
import { stockLevels } from "../constants/rbac";
import { useCustomers } from "../hooks/useCustomers";
import { useInventories } from "../hooks/useInventories";
import { useProducts } from "../hooks/useProducts";
import { useTransactions } from "../hooks/useTransactions";

export default function Inventory({ notify }) {
  const [movementOpen, setMovementOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const { items, meta, filters, status, fetchInventory, fetchSummary, setFilter, clearFilters } = useInventories();
  const { items: products, locations, fetchProducts, fetchLocations } = useProducts();
  const { items: customers, fetchCustomers } = useCustomers();
  const { createMovement, uploadExcel, downloadTemplate } = useTransactions();

  useEffect(() => { fetchProducts({ limit: 100 }); fetchLocations({ limit: 100 }); fetchCustomers({ limit: 100 }); }, []);
  useEffect(() => { fetchInventory(filters); fetchSummary(); }, [filters]);

  const saveMovement = async (payload) => {
    try { await createMovement(payload); notify("Movement saved."); setMovementOpen(false); fetchInventory(filters); fetchSummary(); }
    catch (error) { notify(error.message, "red"); }
  };
  const uploadFile = async (file) => {
    try { const result = await uploadExcel(file); notify(`Imported ${result.accepted?.length || 0} row(s). ${result.errors?.length || 0} error(s).`, result.errors?.length ? "blue" : "green"); setExcelOpen(false); fetchInventory(filters); fetchSummary(); }
    catch (error) { notify(error.message, "red"); }
  };

  const columns = [
    { key: "product", header: "Product", render: (row) => <div><p className="font-bold text-slate-900">{row.product?.code}</p><p className="text-xs text-slate-500">{row.product?.name}</p></div> },
    { key: "serialNo", header: "Serial", render: (row) => row.serialNo || "-" },
    { key: "location", header: "Location", render: (row) => row.location?.name || "-" },
    { key: "qty", header: "Qty", render: (row) => <Badge tone={row.qty < 5 ? "amber" : "green"}>{row.qty}</Badge> },
    { key: "updatedAt", header: "Updated", render: (row) => new Date(row.updatedAt).toLocaleString() },
  ];

  return (
    <div className="space-y-4">
      <PageHeader icon={Boxes} title="Inventory" subtitle="Current stock loaded from backend inventory API." actions={<><Button onClick={() => setMovementOpen(true)}><PackagePlus size={16} /> Movement</Button><Button variant="secondary" onClick={() => setExcelOpen(true)}><FileSpreadsheet size={16} /> Excel Upload</Button></>} />
      <Card><div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]"><SearchInput value={filters.search} onChange={(value) => setFilter("search", value)} placeholder="Search product, serial, location" /><Select value={filters.productCode} onChange={(e) => setFilter("productCode", e.target.value)}><option value="">All products</option>{products.map((p) => <option key={p.id} value={p.code}>{p.code} - {p.name}</option>)}</Select><Select value={filters.customerCode} onChange={(e) => setFilter("customerCode", e.target.value)}><option value="">All customers</option>{customers.map((c) => <option key={c.id} value={c.code}>{c.code} - {c.name}</option>)}</Select><Select value={filters.locationId} onChange={(e) => setFilter("locationId", e.target.value)}><option value="">All locations</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</Select><Select value={filters.stockLevel} onChange={(e) => setFilter("stockLevel", e.target.value)}>{stockLevels.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</Select><Button variant="secondary" onClick={clearFilters}><X size={16} /> Clear</Button></div></Card>
      <Card><DataTable columns={columns} data={items} meta={meta} loading={status === "loading"} onPageChange={(page) => fetchInventory({ ...filters, page })} onLimitChange={(limit) => fetchInventory({ ...filters, limit, page: 1 })} emptyText="No stock found." /></Card>
      <MovementModal open={movementOpen} onClose={() => setMovementOpen(false)} products={products} locations={locations} customers={customers} onSubmit={saveMovement} />
      <ExcelUploadModal open={excelOpen} onClose={() => setExcelOpen(false)} onDownloadTemplate={downloadTemplate} onUpload={uploadFile} />
    </div>
  );
}
