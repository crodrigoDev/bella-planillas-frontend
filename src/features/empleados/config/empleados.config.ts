import type { StatusTone } from "@/components/feedback/statusTone.config";
import type { SelectOption } from "@/lib/types/options.types";
import type {
  EstadoLaboral,
  EstadoLaboralEditable,
} from "../types/empleados.types";

/**
 * Nombre y tono de cada estado laboral
 *
 * @remarks
 * Verde = en regla, azul y ámbar = situación temporal, rojo = fuera de la empresa.
 */
export const ESTADO_LABORAL: Record<
  EstadoLaboral,
  { label: string; tone: StatusTone }
> = {
  ACTIVO: { label: "Activo", tone: "success" },
  VACACIONES: { label: "Vacaciones", tone: "info" },
  LICENCIA: { label: "Licencia", tone: "warning" },
  SUSPENDIDO: { label: "Suspendido", tone: "warning" },
  CESADO: { label: "Cesado", tone: "danger" },
  DESPEDIDO: { label: "Despedido", tone: "danger" },
};

/**
 * Estados a los que RRHH puede cambiar a un empleado activo
 *
 * @remarks
 * CESADO no está: se llega a él dando de baja al empleado.
 */
export const ESTADO_LABORAL_OPTIONS: {
  value: EstadoLaboralEditable;
  label: string;
}[] = (
  ["ACTIVO", "VACACIONES", "LICENCIA", "SUSPENDIDO"] as const satisfies readonly EstadoLaboralEditable[]
).map((value) => ({ value, label: ESTADO_LABORAL[value].label }));

/**
 * Motivos de baja que propone el diseño de Registrar cese
 */
export const MOTIVO_BAJA_OPTIONS: SelectOption[] = [
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
