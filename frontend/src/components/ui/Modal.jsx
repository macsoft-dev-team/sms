import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, children, size = "lg" }) {
  const sizes = { md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl", full: "max-w-7xl" };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 !mt-0 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className={`max-h-[92vh] w-full overflow-hidden rounded-md bg-white shadow-soft ${sizes[size]}`}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
              <div><h3 className="text-lg font-bold text-slate-950">{title}</h3>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>
              <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="max-h-[calc(92vh-88px)] overflow-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
