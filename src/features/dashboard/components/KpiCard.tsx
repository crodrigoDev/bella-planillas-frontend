// src/features/dashboard/components/KpiCard.tsx

interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: string;
  linkText: string;
  iconBg: string;    // Propiedad para el fondo del icono
  iconColor: string; // Propiedad para el color del icono
}

export function KpiCard({ title, value, trend, isPositive, icon, linkText, iconBg, iconColor }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
          
          {/* Aquí usamos las propiedades dinámicas para pintar el icono */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
          </div>
          
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
          }`}>
            <span className="material-symbols-outlined text-[14px]">
              {isPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {trend}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Octubre 2026</p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100">
        <a className="text-xs font-semibold text-[#150AB4] hover:text-[#120990] inline-flex items-center gap-1 group" href="#">
          {linkText} <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>
    </div>
  );
}