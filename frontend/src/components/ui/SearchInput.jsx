import { Search } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search" }) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100" />
    </div>
  );
}
