import type { FilterOption } from "@/lib/types/filters.types";
import type { EstadoLaboralEditable } from "../types/empleados.types";

/**
 * Estados a los que RRHH puede cambiar a un empleado activo
 *
 * @remarks
 * CESADO no está: se llega a él dando de baja al empleado.
 */
export const ESTADO_LABORAL_OPTIONS: {
  value: EstadoLaboralEditable;
  label: string;
}[] = [
  { value: "ACTIVO", label: "Activo" },
  { value: "VACACIONES", label: "Vacaciones" },
  { value: "LICENCIA", label: "Licencia" },
  { value: "SUSPENDIDO", label: "Suspendido" },
];

/**
 * Motivos de baja que propone el diseño de Registrar cese
 */
export const MOTIVO_BAJA_OPTIONS: FilterOption[] = [
  {
    value: "VENCIMIENTO_CONTRATO",
    label: "Vencimiento del plazo del contrato",
  },
  { value: "RENUNCIA", label: "Renuncia voluntaria del trabajador" },
  { value: "MUTUO_DISENSO", label: "Mutuo disenso" },
  { value: "DESPIDO_JUSTIFICADO", label: "Despido justificado (falta grave)" },
  {
    value: "JUBILACION_INVALIDEZ",
    label: "Jubilación o invalidez permanente",
  },
  {
    value: "PERIODO_PRUEBA",
    label: "Término de la relación durante el periodo de prueba",
  },
];
