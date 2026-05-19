import { Bell, ChevronRight, LogOut, Search } from "lucide-react";
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
 
      </div>

      <div className="ml-auto flex items-center gap-3">
       {/*  <button className="relative rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
        </button> */}

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
