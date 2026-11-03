import {
  BriefcaseBusinessIcon,
  CalendarCheckIcon,
  FileTextIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";

import type { SelectOption } from "@/lib/types/options.types";
import type { TipoEvento } from "../types/historial.types";

/** Icono y color del círculo de cada clase de evento en la línea de tiempo */
export const TIPO_EVENTO_ESTILOS: Record<
  TipoEvento,
  { icon: LucideIcon; circulo: string }
> = {
  INGRESO: { icon: UserPlusIcon, circulo: "bg-primary text-primary-foreground" },
  ROTACION: {
    icon: BriefcaseBusinessIcon,
    circulo: "bg-primary text-primary-foreground",
  },
  CONTRATO: { icon: FileTextIcon, circulo: "bg-sky-600 text-white" },
  FAMILIA: { icon: UsersIcon, circulo: "bg-emerald-600 text-white" },
  ESTADO: { icon: UserCogIcon, circulo: "bg-amber-600 text-white" },
  ASISTENCIA: { icon: CalendarCheckIcon, circulo: "bg-teal-600 text-white" },
  FINANCIERO: { icon: WalletIcon, circulo: "bg-slate-600 text-white" },
};

/**
 * Filtros del historial: cada uno agrupa una o más clases de evento
 *
 * @remarks
 * El valor `TODOS` no filtra. Rotación y estado se juntan en "Laboral" para
 * no llenar la barra de filtros con una opción por clase.
 */
export const FILTRO_HISTORIAL_OPTIONS: SelectOption[] = [
  { value: "TODOS", label: "Todo" },
  { value: "LABORAL", label: "Laboral" },
  { value: "CONTRATO", label: "Contratos" },
  { value: "FAMILIA", label: "Familia" },
  { value: "ASISTENCIA", label: "Asistencia" },
  { value: "FINANCIERO", label: "Financiero" },
];

/** Clases de evento que cubre cada filtro */
export const FILTRO_TIPOS: Record<string, TipoEvento[] | null> = {
  TODOS: null,
  LABORAL: ["INGRESO", "ROTACION", "ESTADO"],
  CONTRATO: ["CONTRATO"],
  FAMILIA: ["FAMILIA"],
  ASISTENCIA: ["ASISTENCIA"],
  FINANCIERO: ["FINANCIERO"],
};
