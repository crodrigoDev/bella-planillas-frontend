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

/**
 * Descripciones de los regímenes de pensión, por el nombre que guarda el backend
 */
export const REGIMEN_PENSION_LABELS: Record<string, string> = {
  ONP: "ONP - Sistema Nacional de Pensiones",
  SPP: "SPP - Sistema Privado de Pensiones (AFP)",
};

/**
 * Indica si un régimen de pensión es el de las AFP
 *
 * @remarks
 * Es la misma comprobación que hace el backend al guardar los datos financieros.
 */
export const esRegimenAfp = (nombre: string | undefined): boolean =>
  /AFP|SPP/i.test(nombre ?? "");

/**
 * Tipos de comisión de la AFP, con los valores que acepta el contrato
 */
export const TIPO_COMISION_OPTIONS: FilterOption[] = [
  { value: "FLUJO", label: "Comisión sobre flujo (remuneración)" },
  { value: "MIXTA", label: "Comisión mixta (flujo y saldo)" },
];

/**
 * Tipos de cuenta bancaria, con los valores que acepta el contrato
 */
export const TIPO_CUENTA_OPTIONS: FilterOption[] = [
  { value: "SUELDO", label: "Cuenta sueldo / haberes" },
  { value: "AHORROS", label: "Cuenta de ahorros" },
  { value: "CORRIENTE", label: "Cuenta corriente" },
];

/**
 * Regímenes de salud, con los valores que acepta el contrato
 */
export const REGIMEN_SALUD_OPTIONS: FilterOption[] = [
  { value: "ESSALUD_REGULAR", label: "EsSalud regular" },
  { value: "EPS", label: "EPS" },
  { value: "ESSALUD_Y_EPS", label: "EsSalud y EPS" },
  { value: "SCTR", label: "SCTR salud y pensión" },
];

/** Regímenes de salud que piden los datos de la EPS */
export const REGIMENES_SALUD_CON_EPS = ["EPS", "ESSALUD_Y_EPS"];

/**
 * Opciones de sexo del formulario, con los valores que acepta el contrato
 */
export const SEXO_OPTIONS: FilterOption[] = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
];

/**
 * Opciones de estado civil del formulario, con los valores que acepta el contrato
 */
export const ESTADO_CIVIL_OPTIONS: FilterOption[] = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "CONVIVIENTE", label: "Conviviente" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
];

/**
 * Vínculos del derechohabiente con el empleado, con los valores que acepta el contrato
 */
export const VINCULO_OPTIONS: FilterOption[] = [
  { value: "CONYUGE", label: "Cónyuge" },
  { value: "CONCUBINO", label: "Concubino(a)" },
  { value: "HIJO_MENOR", label: "Hijo menor de edad" },
  { value: "HIJO_MAYOR_INCAPACITADO", label: "Hijo mayor incapacitado" },
  { value: "HIJO_MAYOR_ESTUDIANTE", label: "Hijo mayor estudiante" },
  { value: "MADRE_GESTANTE", label: "Madre gestante" },
];
