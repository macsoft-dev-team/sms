import { useEffect, useState } from "react";
import { Edit, FileSpreadsheet, Package, Plus, Warehouse } from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import SearchInput from "../components/ui/SearchInput";
import ProductModal from "../components/forms/ProductModal";
import MasterExcelModal from "../components/master/MasterExcelModal";
import { useProducts } from "../hooks/useProducts";
import { useCustomers } from "../hooks/useCustomers";
import { downloadMasterSample, parseMasterExcel } from "../utils/masterExcel";

export default function Products({ notify, goInventory }) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [excelOpen, setExcelOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    items,
    meta,
    status,
    fetchProducts,
    createProduct,
    updateProduct,
  } = useProducts();

  const {
    items: customers,
    fetchCustomers,
  } = useCustomers();

  useEffect(() => {
    fetchCustomers({ limit: 100 });
    fetchProducts({ search });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts({ search }), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const submit = async (form) => {
    try {
      const payload = {
        ...form,
        customerId: form.customerId || undefined,
      };

      if (editing) await updateProduct(editing.id, payload);
      else await createProduct(payload);

      notify(editing ? "Product updated." : "Product created.");
      setModalOpen(false);
      setEditing(null);
      fetchProducts({ search });
    } catch (error) {
      notify(error.message, "red");
    }
  };

  const uploadProducts = async (file) => {
    try {
      const rows = await parseMasterExcel(file, "products", { customers });
      let success = 0;

      for (const row of rows) {
        await createProduct(row);
        success += 1;
      }

      notify(`${success} product(s) uploaded.`);
      setExcelOpen(false);
      fetchProducts({ search });
    } catch (error) {
      notify(error.message, "red");
    }
  };

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (row) => <span className="font-bold text-slate-900">{row.code}</span>,
    },
    { key: "name", header: "Name" },
    {
      key: "customer",
      header: "Customer",
      render: (row) => row.customer?.name || "-",
    },
    {
      key: "serialTracking",
      header: "Serial",
      render: (row) => (
        <Badge tone={row.serialTracking ? "blue" : "slate"}>
          {row.serialTracking ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={row.status === "ACTIVE" ? "green" : "red"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => goInventory({ productCode: row.code, customerCode: row.customer?.code || "" })}
          >
            <Warehouse size={15} /> Inventory
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setEditing(row);
              setModalOpen(true);
            }}
          >
            <Edit size={15} /> Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Package}
        title="Products"
        subtitle="Customer-based product master."
        actions={
          <>
            <Button variant="secondary" onClick={() => setExcelOpen(true)}>
              <FileSpreadsheet size={16} /> Excel Upload
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              <Plus size={16} /> Add Product
            </Button>
          </>
        }
      />

      <Card>
        <SearchInput value={search} onChange={setSearch} placeholder="Search products or customers" />
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={items}
          meta={meta}
          loading={status === "loading"}
          onPageChange={(page) => fetchProducts({ search, page })}
          onLimitChange={(limit) => fetchProducts({ search, limit, page: 1 })}
        />
      </Card>

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        product={editing}
        customers={customers}
        onSubmit={submit}
      />

      <MasterExcelModal
        open={excelOpen}
        onClose={() => setExcelOpen(false)}
        title="Upload Products"
        subtitle="Columns: code, name, customerCode, unit, serialTracking, status, description."
        onDownloadSample={() => downloadMasterSample("products")}
        onUpload={uploadProducts}
      />
    </div>
  );
}