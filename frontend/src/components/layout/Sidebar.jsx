import { Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { roleLabel } from "../../constants/rbac";
import { useAuth } from "../../hooks/useAuth";

const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className="group relative flex w-full flex-col outline-none mb-1.5"
    >
      <div className="relative px-3 py-1.5">
        {/* Floating Active Background - Now a subtle Indigo gradient */}
        {active && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 border border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            initial={false}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}

        {/* Content */}
        <div
          className={`relative z-10 flex h-10 w-full items-center justify-between rounded-xl px-3 transition-colors duration-200 group-focus-visible:ring-2 group-focus-visible:ring-indigo-500/50 ${active ? "text-white" : "text-slate-400 hover:text-slate-100"
            }`}
        >
          <div className="flex items-center gap-3">
            <Icon
              size={18}
              strokeWidth={active ? 2.5 : 2}
              className={`transition-all duration-300 ${active ? "text-indigo-400" : "group-hover:text-indigo-400/80"
                }`}
            />
            <span className="truncate text-sm font-semibold tracking-wide">
              {item.label}
            </span>
          </div>

          {/* Badge styled to match the new Indigo theme */}
          {item.badge && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500/20 px-1.5 text-[10px] font-bold text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              {item.badge}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default function Sidebar({ nav = [], tab, setTab }) {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return "US";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  return (
    // Base background changed to an ultra-deep blue-gray for better contrast with indigo
    <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-hidden bg-[#04060C] text-slate-100 lg:flex relative border-r border-white/[0.04]">

      {/* Dual Ambient Background Glows for depth */}
      <div className="absolute top-[-5%] left-[-10%] w-[80%] h-64 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-20%] w-[60%] h-64 rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 shrink-0 p-6 pb-2">
        <div className="flex items-center gap-3">
          {/* Logo container tweaked to support transparent PNGs better */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 shadow-sm p-1">
            <img src="/macsoft-logo.png" alt="logo" className="object-contain" />
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <h1 className="truncate font-extrabold tracking-wider text-white">
              STOCK MANAGEMENT
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-400/80">
              SYSTEM
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-6 scrollbar-hide">
        <div className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500/70">
          Main Menu
        </div>
        <div className="flex flex-col">
          {nav.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={tab === item.key}
              onClick={() => setTab(item.key)}
            />
          ))}
        </div>
      </nav>

      {/* Glassmorphism Profile Card */}
      <div className="relative z-10 shrink-0 p-4">
        <button className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] hover:border-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 text-left shadow-xl">

          <div className="relative">
            {/* Avatar now has a subtle indigo glow on hover */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white border border-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              {initials}
            </div>
            {/* Kept the status dot Emerald (green) because standard UX dictates Green = Online/Active */}
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#04060C] bg-emerald-500" />
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <p className="truncate text-sm font-bold text-white group-hover:text-indigo-50 transition-colors">
                {user?.name || "System Admin"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Activity size={10} className="text-indigo-400" />
                <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors">
                  {roleLabel?.[user?.role] || user?.role || "Owner"}
                </p>
              </div>
            </div>

            <ChevronRight size={16} className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400" />
          </div>
        </button>
      </div>
    </aside>
  );
}