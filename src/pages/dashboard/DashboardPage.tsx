// src/pages/dashboard/DashboardPage.tsx
import { KpiCard } from "../../features/dashboard/components/KpiCard";
import { BirthdaysList } from "../../features/dashboard/components/BirthdaysList";
import { PendingRequests } from "../../features/dashboard/components/PendingRequests";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* 1. TÍTULO */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard de Recursos Humanos</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-0.5">Resumen de personal, asistencia y novedades del periodo</p>
      </div>

      {/* 2. LAS 4 TARJETAS (FASE 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Colaboradores (Azul #150AB4) */}
        <KpiCard 
          title="Colaboradores activos" 
          value="128" 
          trend="+4 vs. agosto" 
          isPositive={true} 
          icon="group"
          linkText="Ver listado de activos"
          iconBg="bg-[#150AB4]/10" 
          iconColor="text-[#150AB4]"
        />
        
        {/* 2. Ingresos (Verde) */}
        <KpiCard 
          title="Ingresos del periodo" 
          value="7" 
          trend="+5 vs. agosto" 
          isPositive={true} 
          icon="person_add"
          linkText="Ver nuevos colaboradores"
          iconBg="bg-emerald-50" 
          iconColor="text-emerald-600"
        />
        
        {/* 3. Ceses (Amarillo) */}
        <KpiCard 
          title="Ceses del periodo" 
          value="3" 
          trend="-1 vs. agosto" 
          isPositive={false} 
          icon="person_remove"
          linkText="Ver cesados"
          iconBg="bg-amber-50" 
          iconColor="text-amber-500"
        />
        
        {/* 4. Rotación (Azul #150AB4) */}
        <KpiCard 
          title="Rotación de personal" 
          value="2.4 %" 
          trend="-0.8 pp vs. agosto" 
          isPositive={false} 
          icon="autorenew"
          linkText="Ver reporte"
          iconBg="bg-[#150AB4]/10" 
          iconColor="text-[#150AB4]"
        />

      </div>

      {/* 3. LAS LISTAS (FASE 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <BirthdaysList />
        <PendingRequests />
      </div>
      
    </div>
  );
}