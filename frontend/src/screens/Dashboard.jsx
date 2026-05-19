import { useEffect } from "react";
import { Boxes, ClipboardList, LayoutDashboard, Package, TrendingDown } from "lucide-react";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import { useInventories } from "../hooks/useInventories";
import { useProducts } from "../hooks/useProducts";
import { useTransactions } from "../hooks/useTransactions";

export default function Dashboard() {
  const { summary, fetchSummary } = useInventories();
  const { items: products, fetchProducts } = useProducts();
  const { items: transactions, fetchTransactions, status } = useTransactions();

  useEffect(() => { fetchSummary(); fetchProducts({ limit: 5 }); fetchTransactions({ limit: 8 }); }, []);

  const cards = [
    { label: "Products", value: summary?.productCount ?? products.length, icon: Package, tone: "bg-slate-50 text-[#111C33]" },
    { label: "Stock Qty", value: summary?.totalQty ?? 0, icon: Boxes, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Movements", value: transactions.length, icon: ClipboardList, tone: "bg-amber-50 text-amber-700" },
    { label: "Low Stock", value: summary?.lowStockLines ?? 0, icon: TrendingDown, tone: "bg-red-50 text-red-700" },
  ];
  const columns = [
    { key: "referenceNo", header: "Reference", render: (row) => <span className="font-bold text-slate-900">{row.referenceNo}</span> },
    { key: "type", header: "Type", render: (row) => <Badge tone={row.type === "INBOUND" ? "green" : row.type === "OUTBOUND" ? "red" : "blue"}>{row.type}</Badge> },
    { key: "lines", header: "Lines", render: (row) => row.lines?.length || 0 },
    { key: "createdAt", header: "Date", render: (row) => new Date(row.createdAt).toLocaleString() },
  ];
  return (
    <div className="space-y-4">
      <PageHeader icon={LayoutDashboard} title="Dashboard" subtitle="Live overview from backend APIs." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => { const Icon = card.icon; return <Card key={card.label}><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{card.label}</p><p className="mt-1 text-3xl font-bold text-slate-950">{card.value}</p></div><div className={`rounded-md p-3 ${card.tone}`}><Icon size={22} /></div></div></Card>; })}</div>
      <Card><h3 className="mb-3 text-base font-bold text-slate-950">Recent movements</h3><DataTable columns={columns} data={transactions} loading={status === "loading"} emptyText="No movements found." /></Card>
    </div>
  );
}
