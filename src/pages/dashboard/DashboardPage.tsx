// src/pages/dashboard/DashboardPage.tsx
import { KpiCard } from "../../features/dashboard/components/KpiCard";
import { BirthdaysList } from "../../features/dashboard/components/BirthdaysList";
import { PendingRequests } from "../../features/dashboard/components/PendingRequests";
import { AreaDistribution } from "../../features/dashboard/components/AreaDistribution";
import { WeeklyAttendance } from "../../features/dashboard/components/WeeklyAttendance";

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6">
      
      {/* TÍTULO (Empezará exactamente a 72px, alineado con el de arriba) */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Dashboard de Recursos Humanos</h2>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">Resumen de personal, asistencia y novedades del periodo</p>
      </div>

      {/* LAS 4 TARJETAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Colaboradores activos" value="128" trend="+4 vs. agosto" isPositive={true} icon="group" linkText="Ver listado de activos" iconBg="bg-[#150AB4]/10" iconColor="text-[#150AB4]" />
        <KpiCard title="Ingresos del periodo" value="7" trend="+5 vs. agosto" isPositive={true} icon="person_add" linkText="Ver nuevos colaboradores" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <KpiCard title="Ceses del periodo" value="3" trend="-1 vs. agosto" isPositive={false} icon="person_remove" linkText="Ver cesados" iconBg="bg-amber-50" iconColor="text-amber-500" />
        <KpiCard title="Rotación de personal" value="2.4 %" trend="-0.8 pp vs. agosto" isPositive={false} icon="autorenew" linkText="Ver reporte" iconBg="bg-[#150AB4]/10" iconColor="text-[#150AB4]" />
      </div>

      {/* LOS GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WeeklyAttendance />
        </div>
        <div className="lg:col-span-5">
          <AreaDistribution />
        </div>
      </div>

      {/* LAS LISTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <BirthdaysList />
        <PendingRequests />
      </div>

    </div>
  );
}