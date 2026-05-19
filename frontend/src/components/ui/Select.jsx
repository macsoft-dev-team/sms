export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>}
      <select className={`w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 ${className}`} {...props}>{children}</select>
    </label>
  );
}
