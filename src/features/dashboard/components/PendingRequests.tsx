// src/features/dashboard/components/PendingRequests.tsx

interface Request {
  id: string;
  initials: string;
  name: string;
  type: string;
  typeColor: string;
  avatarColor: string; // <-- Nueva propiedad
  details: string;
  area: string;
  time: string;
}

const mockRequests: Request[] = [
  { 
    id: '1', 
    initials: 'CM', 
    name: 'Camila Morales Rivera', 
    type: 'Vacaciones', 
    typeColor: 'bg-blue-50 text-blue-700 border-blue-100', 
    avatarColor: 'bg-blue-50 text-blue-700 border-blue-100', // <-- Aquí aplicamos el azul
    details: '10 días solicitados (15 Oct – 25 Oct)', 
    area: 'Tecnología & Desarrollo', 
    time: '• 28/09/2026 10:45 AM' 
  },
  { 
    id: '2', 
    initials: 'JM', 
    name: 'Jorge Ignacio Morales', 
    type: 'Permiso médico', 
    typeColor: 'bg-amber-50 text-amber-700 border-amber-200', 
    avatarColor: 'bg-amber-50 text-amber-700 border-amber-200', // <-- Ajustamos los demás para que combinen
    details: '1 día con goce (14 Oct)', 
    area: 'Operaciones & Logística', 
    time: '• 28/09/2026 09:30 AM' 
  },
  { 
    id: '3', 
    initials: 'LT', 
    name: 'Lucía Torres Silva', 
    type: 'Justificación', 
    typeColor: 'bg-[#F2F1FF] text-[#150AB4] border-[#150AB4]/20', 
    avatarColor: 'bg-[#F2F1FF] text-[#150AB4] border-[#150AB4]/20', 
    details: '3 días excepcionales (20 Oct – 22 Oct)', 
    area: 'Tecnología & Desarrollo', 
    time: '• 28/09/2026 07:15 AM' 
  },
  { 
    id: '4', 
    initials: 'VP', 
    name: 'Valeria Sofía Pardo', 
    type: 'Adelanto', 
    typeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    avatarColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    details: 'S/ 1,200.00 a descontar en quincena', 
    area: 'Ventas & Comercial', 
    time: '• 27/09/2026 04:20 PM' 
  },
];

export function PendingRequests() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F2F1FF] text-[#150AB4] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 truncate">Solicitudes pendientes</h3>
                <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">4 por revisar</span>
              </div>
            </div>
          </div>
          <a className="text-xs font-semibold text-[#150AB4] hover:text-[#120990] transition-colors flex items-center gap-0.5" href="#">
            <span>Gestionar todas</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {mockRequests.map((req) => (
            <div key={req.id} className="py-3 px-2 hover:bg-slate-50/80 rounded-lg transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                
                {/* AVATAR DINÁMICO: Usa req.avatarColor en lugar de un color fijo */}
                <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 border ${req.avatarColor}`}>
                  {req.initials}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-900 truncate">{req.name}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${req.typeColor}`}>{req.type}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{req.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{req.details} • {req.area}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}