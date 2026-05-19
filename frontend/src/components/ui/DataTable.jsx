import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Button from "./Button";

export default function DataTable({ columns, data, meta, loading, emptyText = "No records found.", onPageChange, onLimitChange }) {
  const page = meta?.page || 1;
  const limit = meta?.limit || 10;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="space-y-3">
      <div className="overflow-auto rounded-md border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>{columns.map((column) => <th key={column.key} className="p-3 font-bold">{column.header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td className="p-8 text-center text-slate-500" colSpan={columns.length}><span className="inline-flex items-center gap-2"><Loader2 className="animate-spin text-[#0B1220]" size={18} /> Loading...</span></td></tr>
            ) : data.length ? data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-slate-50">
                {columns.map((column) => <td key={column.key} className="p-3 align-middle">{column.render ? column.render(row, index) : row[column.key]}</td>)}
              </tr>
            )) : (
              <tr><td className="p-8 text-center text-slate-500" colSpan={columns.length}>{emptyText}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {meta && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages} · {meta.total || 0} records</p>
          <div className="flex items-center gap-2">
            <select value={limit} onChange={(event) => onLimitChange?.(Number(event.target.value))} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100">
              {[10, 20, 50, 100].map((size) => <option key={size} value={size}>{size} / page</option>)}
            </select>
            <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}><ChevronLeft size={16} /> Prev</Button>
            <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>Next <ChevronRight size={16} /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
