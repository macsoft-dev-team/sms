export default function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0B1220] text-white">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-950 uppercase">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
