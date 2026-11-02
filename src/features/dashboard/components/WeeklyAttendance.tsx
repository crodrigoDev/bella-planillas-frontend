// src/features/dashboard/components/WeeklyAttendance.tsx
import { useState } from "react";

const attendanceData = {
  puntual: { 
    color: "bg-emerald-500", 
    dot: "bg-emerald-500", 
    border: "border-emerald-300",
    text: "text-emerald-700", 
    values: [124, 122, 120, 123, 125], 
    heights: [96.9, 95.3, 93.8, 96.1, 97.7],
    // NUEVOS DATOS PARA EL FOOTER
    rate: "94.2%",
    summaryLabel: "puntualidad promedio semanal",
    avg: "Promedio: 123 colaboradores a tiempo / día"
  },
  tardanza: { 
    color: "bg-amber-500", 
    dot: "bg-amber-500", 
    border: "border-amber-300",
    text: "text-amber-700", 
    values: [3, 4, 5, 3, 2], 
    heights: [50, 66.7, 83.3, 50, 33.3],
    // NUEVOS DATOS PARA EL FOOTER
    rate: "2.7%",
    summaryLabel: "tardanza promedio semanal",
    avg: "Promedio: 3.4 colaboradores con tardanza / día"
  },
  falta: { 
    color: "bg-rose-500", 
    dot: "bg-rose-500", 
    border: "border-rose-300",
    text: "text-rose-700", 
    values: [1, 2, 3, 2, 1], 
    heights: [33.3, 66.7, 100, 66.7, 33.3],
    // NUEVOS DATOS PARA EL FOOTER
    rate: "1.4%",
    summaryLabel: "inasistencia promedio semanal",
    avg: "Promedio: 1.8 ausencias / día"
  }
};

const days = [
  { day: "Lun", date: "22 Sep" },
  { day: "Mar", date: "23 Sep" },
  { day: "Mié", date: "24 Sep" },
  { day: "Jue", date: "25 Sep" },
  { day: "Vie", date: "26 Sep" }
];

type TabType = "puntual" | "tardanza" | "falta";

export function WeeklyAttendance() {
  const [activeTab, setActiveTab] = useState<TabType>("puntual");
  const currentData = attendanceData[activeTab];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Asistencia de la semana</h3>
            <p className="text-[11px] text-slate-400">Registro consolidado de los últimos 5 días laborables (Lun-Vie)</p>
          </div>
          
          {/* Botones de Pestañas */}
          <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-lg border border-slate-200/60 gap-1 text-xs">
            {(Object.keys(attendanceData) as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer border ${
                  activeTab === tab 
                    ? `bg-white shadow-sm font-semibold ${attendanceData[tab].text} ${attendanceData[tab].border}` 
                    : 'border-transparent font-medium text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${attendanceData[tab].dot}`}></span>
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico de Barras */}
        <div className="pt-8 pb-2 relative">
          <div className="grid grid-cols-5 gap-3 sm:gap-5 items-end h-48">
            {days.map((day, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer relative h-full justify-end">
                <span className="text-[11px] font-semibold text-slate-700 mb-2 transition-colors">
                  {currentData.values[index]}/128
                </span>
                <div className="w-full max-w-[48px] h-full bg-slate-100/80 rounded-lg p-1 flex flex-col justify-end border border-slate-200/60 group-hover:border-[#150AB4]/30 transition-all">
                  <div 
                    className={`w-full rounded-md transition-all duration-500 ease-in-out ${currentData.color}`} 
                    style={{ height: `${currentData.heights[index]}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-800 mt-2.5">{day.day}</span>
                <span className="text-[10px] text-slate-400 font-medium">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER (El resumen de abajo) */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
            <span className={`w-2 h-2 rounded-full ${currentData.dot}`}></span>
            <strong className="text-slate-900 font-semibold">{currentData.rate}</strong>
            <span>{currentData.summaryLabel}</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">{currentData.avg}</span>
        </div>
        <a className="font-semibold text-[#150AB4] hover:underline flex items-center gap-0.5" href="#">
          <span>Ver reporte detallado</span>
          <span>→</span>
        </a>
      </div>

    </div>
  );
}