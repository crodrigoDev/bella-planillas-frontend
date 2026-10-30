import type { SelectOption } from "@/lib/types/options.types";

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
export const TIPO_COMISION_OPTIONS: SelectOption[] = [
  { value: "FLUJO", label: "Comisión sobre flujo (remuneración)" },
  { value: "MIXTA", label: "Comisión mixta (flujo y saldo)" },
];

/**
 * Tipos de cuenta bancaria, con los valores que acepta el contrato
 */
export const TIPO_CUENTA_OPTIONS: SelectOption[] = [
  { value: "SUELDO", label: "Cuenta sueldo / haberes" },
  { value: "AHORROS", label: "Cuenta de ahorros" },
  { value: "CORRIENTE", label: "Cuenta corriente" },
];

/**
 * Regímenes de salud, con los valores que acepta el contrato
 */
export const REGIMEN_SALUD_OPTIONS: SelectOption[] = [
  { value: "ESSALUD_REGULAR", label: "EsSalud regular" },
  { value: "EPS", label: "EPS" },
  { value: "ESSALUD_Y_EPS", label: "EsSalud y EPS" },
  { value: "SCTR", label: "SCTR salud y pensión" },
];

/** Regímenes de salud que piden los datos de la EPS */
export const REGIMENES_SALUD_CON_EPS = ["EPS", "ESSALUD_Y_EPS"];
