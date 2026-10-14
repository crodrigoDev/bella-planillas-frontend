import type { EstadoEmpleado } from "@jyp/shared-contracts";

export const ESTADOS_LABORALES = {
  ACTIVO: {
    label: "Activo",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  VACACIONES: {
    label: "Vacaciones",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  LICENCIA: {
    label: "Licencia",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  SUSPENDIDO: {
    label: "Suspendido",
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  CESADO: {
    label: "Cesado",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
} satisfies Record<EstadoEmpleado, { label: string; className: string }>;

export const TURNOS: Record<string, string> = {
  MANANA: "Turno mañana",
  TARDE: "Turno tarde",
  NOCHE: "Turno noche",
  MIXTO: "Turno mixto",
  ROTATIVO: "Turno rotativo",
};

export const REGIMENES_SALUD: Record<string, string> = {
  ESSALUD_REGULAR: "EsSalud regular",
  EPS: "EPS",
  ESSALUD_Y_EPS: "EsSalud y EPS",
  SCTR: "SCTR",
};
