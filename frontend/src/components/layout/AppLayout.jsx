import { AnimatePresence, motion } from "framer-motion";
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
              className={`rounded-md border bg-white p-3 text-sm shadow-lg ${
                toast.tone === "red"
                  ? "border-rose-200 text-rose-700"
                  : "border-slate-200 text-slate-700"
              }`}
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
