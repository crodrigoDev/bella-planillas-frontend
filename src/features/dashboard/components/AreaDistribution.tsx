// src/features/dashboard/components/AreaDistribution.tsx

const areasData = [
  { name: "Operaciones & Logística", count: 42, percent: 32.8, color: "bg-[#150AB4]" },
  { name: "Tecnología & Desarrollo", count: 34, percent: 26.6, color: "bg-indigo-600" },
  { name: "Ventas & Comercial", count: 26, percent: 20.3, color: "bg-sky-500" },
  { name: "Administración & Finanzas", count: 16, percent: 12.5, color: "bg-violet-500" },
  { name: "Recursos Humanos", count: 10, percent: 7.8, color: "bg-purple-400" },
];

export function AreaDistribution() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Distribución por área</h3>
            <p className="text-[11px] text-slate-400">Participación sobre el total de 128 colaboradores</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">5 áreas</span>
        </div>
        <div className="pt-4 space-y-4">
          {areasData.map((area, index) => (
            <div key={index}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800">{area.name}</span>
                <span className="text-slate-500">
                  <strong className="text-slate-900 font-semibold">{area.count}</strong> ({area.percent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className={`${area.color} h-2 rounded-full transition-all duration-500`} 
                  style={{ width: `${area.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[11px] text-slate-400">Total: 128 colaboradores activos</span>
        <a className="text-xs font-semibold text-[#150AB4] hover:underline" href="#">Gestionar áreas →</a>
      </div>
    </div>
  );
}