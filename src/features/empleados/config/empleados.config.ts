import type { SelectOption } from "@/lib/types/options.types";
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

/**
 * Opciones de sexo del formulario, con los valores que acepta el contrato
 */
export const SEXO_OPTIONS: SelectOption[] = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

/**
 * Opciones de estado civil del formulario, con los valores que acepta el contrato
 */
export const ESTADO_CIVIL_OPTIONS: SelectOption[] = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "CONVIVIENTE", label: "Conviviente" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
];
