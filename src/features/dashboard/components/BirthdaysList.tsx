// src/features/dashboard/components/BirthdaysList.tsx

interface BirthdayPerson {
  id: string;
  name: string;
  role: string;
  area: string;
  date: string;
  daysLeft: string;
  isUrgent?: boolean;
}

const mockBirthdays: BirthdayPerson[] = [
  { id: '1', name: 'Camila Morales Rivera', role: 'Diseñadora UX/UI', area: 'Tecnología & Desarrollo', date: '08 Oct', daysLeft: 'En 4 días', isUrgent: true },
  { id: '2', name: 'Rodrigo Castillo Paz', role: 'Analista de Selección', area: 'Recursos Humanos', date: '14 Oct', daysLeft: 'En 10 días' },
  { id: '3', name: 'Carlos Andrés Méndez Ruiz', role: 'Supervisor de Almacén', area: 'Operaciones & Logística', date: '19 Oct', daysLeft: 'En 15 días' },
  { id: '4', name: 'Lucía Torres Silva', role: 'Ingeniera de Software', area: 'Tecnología & Desarrollo', date: '24 Oct', daysLeft: 'En 20 días' },
];

export function BirthdaysList() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F2F1FF] text-[#150AB4] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">cake</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Próximos cumpleaños</h3>
                <span className="text-[11px] font-semibold bg-[#F2F1FF] text-[#150AB4] border border-[#150AB4]/20 px-2 py-0.5 rounded-full">Octubre 2026</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100 mt-2">
          {mockBirthdays.map((person) => (
            <div key={person.id} className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50/80 rounded-lg transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900 truncate">{person.name}</span>
                    {person.isUrgent && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Próximo</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{person.role} • {person.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-900 block">{person.date}</span>
                  <span className={`text-[10px] font-medium block ${person.isUrgent ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {person.daysLeft}
                  </span>
                </div>
                <button className="w-7 h-7 rounded-lg text-slate-400 hover:text-[#150AB4] hover:bg-[#F2F1FF] flex items-center justify-center transition-colors" type="button">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}