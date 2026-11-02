// src/features/dashboard/components/DashboardHeader.tsx
import { useState, useEffect, useRef } from "react";

export function DashboardHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Lógica para cerrar el menú si haces clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end gap-3 md:gap-4">
      
      {/* Selector de Fecha */}
      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-medium shadow-xs">
        <span className="material-symbols-outlined text-[16px] text-slate-600">calendar_month</span>
        <span className="font-semibold text-slate-800">Octubre 2026</span>
      </div>

      {/* Buscador (Sin el Ctrl K) */}
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <span className="material-symbols-outlined text-[18px]">search</span>
        </div>
        <input 
          className="w-64 focus:w-80 md:w-72 md:focus:w-96 pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#150AB4]/20 focus:border-[#150AB4] transition-all duration-200" 
          placeholder="Buscar empleado..." 
          type="text" 
        />
      </div>

      {/* CONTENEDOR DE LA CAMPANITA */}
      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#150AB4]/20 cursor-pointer" 
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#150AB4] text-[10px] font-bold text-white shadow-xs">
            4
          </span>
        </button>

        {/* EL MENÚ DESPLEGABLE */}
        {isNotifOpen && (
          <div className="absolute right-0 mt-2 w-[350px] sm:w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden transform transition-all duration-150 origin-top-right">
            
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">Notificaciones</span>
                <span className="text-[11px] font-semibold bg-[#150AB4]/10 text-[#150AB4] px-2 py-0.5 rounded-full">4 nuevas</span>
              </div>
              <button className="text-xs text-[#150AB4] hover:text-[#100771] font-medium transition-colors hover:underline cursor-pointer">
                Marcar todo como leído
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
              
              {/* Item 1 */}
              <div className="p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-slate-900">Solicitud</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500">hace 15 min</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    Aprobación de vacaciones pendiente para <span className="font-medium text-slate-900">Roberto Gómez</span>
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#150AB4] flex-shrink-0 mt-2"></span>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-slate-900">Contratos</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500">hace 2 horas</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    3 contratos vencen en los próximos 15 días
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#150AB4] flex-shrink-0 mt-2"></span>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-slate-900">Asistencia</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500">hace 4 horas</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-snug">
                    Tardanza injustificada registrada - Operaciones
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#150AB4] flex-shrink-0 mt-2"></span>
              </div>
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50/60 text-center">
              <a className="text-xs font-medium text-[#150AB4] hover:text-[#100771] transition-colors py-1 inline-block" href="#">
                Ver todas las notificaciones
              </a>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}