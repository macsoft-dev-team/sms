import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Boxes, LayoutDashboard, Package, ShoppingBag, UserCircle, Users } from "lucide-react";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./screens/Dashboard";
import Inventory from "./screens/Inventory";
import Products from "./screens/Products";
import Customers from "./screens/Customers";
import UsersPage from "./screens/UsersPage";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import { useAuth } from "./hooks/useAuth";
import { useInventories } from "./hooks/useInventories";
import { useInventorySocket } from "./hooks/useInventorySocket";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const { isAuthenticated, user, isAdmin, fetchMe } = useAuth();
  const { setFilters } = useInventories();
  useInventorySocket(isAuthenticated);

  useEffect(() => { if (isAuthenticated && !user) fetchMe().catch(() => {}); }, [isAuthenticated, user]);

  const notify = (message, tone = "green") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2800);
  };

  if (!isAuthenticated) return <Login />;

  const nav = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "inventory", label: "Inventory", icon: Boxes },
    { key: "products", label: "Products", icon: Package },
    { key: "customers", label: "Customers", icon: ShoppingBag },
    ...(isAdmin ? [{ key: "users", label: "Users & RBAC", icon: Users }] : []),
    { key: "profile", label: "Profile", icon: UserCircle },
  ];

  const goInventory = (filters) => {
    setFilters({ search: "", productCode: "", customerCode: "", locationId: "", stockLevel: "", ...filters });
    setTab("inventory");
  };

  return (
    <AppLayout nav={nav} tab={tab} setTab={setTab} toast={toast}>
      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {tab === "dashboard" && <Dashboard />}
        {tab === "inventory" && <Inventory notify={notify} />}
        {tab === "products" && <Products notify={notify} goInventory={goInventory} />}
        {tab === "customers" && <Customers notify={notify} goInventory={goInventory} />}
        {tab === "users" && <UsersPage notify={notify} />}
        {tab === "profile" && <Profile notify={notify} />}
      </motion.div>
    </AppLayout>
  );
}
