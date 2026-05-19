const fs = require("fs");

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function replaceAllInSrc(find, replace) {
  const walk = (dir) => {
    for (const item of fs.readdirSync(dir)) {
      const path = `${dir}/${item}`;
      const stat = fs.statSync(path);
      if (stat.isDirectory()) walk(path);
      else if (path.endsWith(".jsx") || path.endsWith(".js") || path.endsWith(".css")) {
        let text = fs.readFileSync(path, "utf8");
        text = text.split(find).join(replace);
        fs.writeFileSync(path, text, "utf8");
      }
    }
  };
  walk("src");
}

replaceAllInSrc("rounded-[2rem]", "rounded-md");
replaceAllInSrc("rounded-3xl", "rounded-md");
replaceAllInSrc("rounded-2xl", "rounded-md");
replaceAllInSrc("rounded-xl", "rounded-md");
replaceAllInSrc("bg-blue-600", "bg-[#0B1220]");
replaceAllInSrc("hover:bg-blue-700", "hover:bg-[#111C33]");
replaceAllInSrc("text-blue-600", "text-[#0B1220]");
replaceAllInSrc("text-blue-700", "text-[#111C33]");
replaceAllInSrc("bg-blue-50/80", "bg-slate-100");
replaceAllInSrc("bg-blue-50/60", "bg-slate-50");
replaceAllInSrc("bg-blue-50/40", "bg-slate-50");
replaceAllInSrc("bg-blue-50", "bg-slate-50");
replaceAllInSrc("hover:bg-blue-50", "hover:bg-slate-100");
replaceAllInSrc("focus:border-blue-300", "focus:border-slate-400");
replaceAllInSrc("focus:ring-blue-100", "focus:ring-slate-100");

write("src/components/ui/PageHeader.jsx", `export default function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1220] text-white">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
`);

write("src/components/ui/Card.jsx", `export default function Card({ children, className = "" }) {
  return (
    <div className={\`rounded-md border border-slate-200 bg-white p-4 shadow-sm \${className}\`}>
      {children}
    </div>
  );
}
`);

write("src/components/ui/Button.jsx", `export default function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

  const variants = {
    primary: "bg-[#0B1220] text-white shadow-sm hover:bg-[#111C33]",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-[#0B1220]",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };

  return (
    <button className={\`\${base} \${variants[variant]} \${className}\`} {...props}>
      {children}
    </button>
  );
}
`);

write("src/components/layout/AppLayout.jsx", `import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children, nav, tab, setTab, toast }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-slate-300">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-4 z-50 w-[92%] max-w-md -translate-x-1/2"
          >
            <div
              className={\`rounded-md border bg-white p-3 text-sm shadow-lg \${
                toast.tone === "red"
                  ? "border-rose-200 text-rose-700"
                  : "border-slate-200 text-slate-700"
              }\`}
            >
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar nav={nav} tab={tab} setTab={setTab} />

      <div className="relative flex w-0 flex-1 flex-col overflow-hidden">
        <Topbar nav={nav} tab={tab} />

        <main className="relative flex-1 overflow-y-auto p-4 focus:outline-none sm:p-6 lg:p-8">
          <div className="mx-auto min-h-full max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
`);

write("src/components/layout/Sidebar.jsx", `import { Activity, Boxes } from "lucide-react";
import { motion } from "framer-motion";
import { roleLabel } from "../../constants/rbac";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar({ nav, tab, setTab }) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-hidden border-r border-slate-800 bg-[#0B1220] text-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.12)] lg:flex">
      <div className="shrink-0 border-b border-white/10 p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-[#0B1220]">
            <Boxes size={20} />
          </div>
          <div className="min-w-0">
            <span className="truncate text-lg font-bold tracking-widest text-white">
              SUNSHAFT
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Inventory WMS
            </p>
          </div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-4">
        <div className="mb-2 px-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Menu
        </div>

        {nav.map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className="group relative mb-1 block w-full outline-none"
            >
              <div className="relative flex h-10 items-center">
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/2 z-10 h-8 w-[3px] -translate-y-1/2 rounded-r bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div
                  className={\`relative mx-3 flex h-full w-full items-center gap-3 rounded-md px-3 transition-all duration-200 \${
                    active
                      ? "bg-white text-[#0B1220]"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }\`}
                >
                  <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                  <span className="truncate text-sm font-semibold tracking-wide">
                    {item.label}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="relative z-10 shrink-0 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-md bg-white/5 p-2">
          <div className="relative">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-sm font-bold text-[#0B1220]">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B1220] bg-emerald-500" />
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-between">
            <div>
              <p className="truncate text-sm font-bold leading-tight text-white">
                {user?.name || "System Admin"}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                {roleLabel[user?.role] || user?.role || "Owner"}
              </p>
            </div>
            <Activity size={14} className="text-emerald-400" />
          </div>
        </div>
      </div>
    </aside>
  );
}
`);

write("src/components/layout/Topbar.jsx", `import { Bell, ChevronRight, LogOut, Search } from "lucide-react";
import { roleLabel } from "../../constants/rbac";
import { useAuth } from "../../hooks/useAuth";

export default function Topbar({ nav = [], tab }) {
  const { user, logout } = useAuth();
  const pageTitle = nav.find((item) => item.key === tab)?.label;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        {pageTitle && (
          <div className="hidden items-center gap-1.5 text-sm select-none lg:flex">
            <span className="font-medium text-slate-400">WMS</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="font-semibold text-slate-900">{pageTitle}</span>
          </div>
        )}

        <div className="relative hidden max-w-md flex-1 xl:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            placeholder="Search workspace"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3 rounded-md p-1 pr-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0B1220] text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-none text-slate-700">
              {user?.name || "—"}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {roleLabel[user?.role] || user?.role || "—"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          title="Logout"
          className="rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
`);

console.log("UI patch applied: small rounded corners, dark navy theme, redesigned sidebar, plain page headers.");
