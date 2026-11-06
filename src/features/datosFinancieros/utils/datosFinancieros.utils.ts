import type { DefaultValues } from "react-hook-form";

import type {
  DatosFinancierosFichaDatos,
  DatosFinancierosFichaFormValues,
} from "../schemas/datosFinancierosFicha.schema";
import type { DatosFinancieros } from "../types/datosFinancieros.types";

// Valores con los que empiezan los datos financieros de un empleado sin registro
export const INITIAL_VALUES = {
  tipo_cuenta_sueldo: "SUELDO",
  tipo_cuenta_cts: "AHORROS",
  regimen_salud: "ESSALUD_REGULAR",
  eps_costo_adicional: 0,
} as const;

/**
 * Convierte los datos guardados en los valores iniciales del formulario
 *
 * @remarks
 * Las cuentas, CCI y CUSPP no se cargan: el backend solo los devuelve enmascarados.
 */
export const toFormValues = (
  datos: DatosFinancieros | null,
): DefaultValues<DatosFinancierosFichaFormValues> =>
  datos
    ? {
        id_regimen: datos.id_regimen,
        id_tipo_afp: datos.id_tipo_afp ?? undefined,
        tipo_comision: datos.tipo_comision ?? undefined,
        sueldo_basico: datos.sueldo_basico,
        id_banco_sueldo: datos.id_banco_sueldo ?? undefined,
        tipo_cuenta_sueldo:
          datos.tipo_cuenta_sueldo as DatosFinancierosFichaFormValues["tipo_cuenta_sueldo"],
        id_banco_cts: datos.id_banco_cts ?? undefined,
        tipo_cuenta_cts:
          datos.tipo_cuenta_cts as DatosFinancierosFichaFormValues["tipo_cuenta_cts"],
        regimen_salud:
          datos.regimen_salud as DatosFinancierosFichaFormValues["regimen_salud"],
        eps_nombre: datos.eps_nombre ?? undefined,
        eps_plan: datos.eps_plan ?? undefined,
        eps_costo_adicional: datos.eps_costo_adicional,
      }
    : INITIAL_VALUES;

/**
 * Prepara el cambio que se envía al backend
 *
 * @remarks
 * Un campo vacío o sin enviar queda como estaba en el backend, por eso lo que
 * el usuario quitó (banco, AFP, EPS) se envía como `null`. Una cuenta o un CCI
 * vacío se omite para no tocar el que ya está guardado, salvo que se quite el banco.
 */
export const toCambios = (
  values: DatosFinancierosFichaDatos,
  esAfp: boolean,
  conEps: boolean,
) => ({
  ...values,
  id_tipo_afp: esAfp ? values.id_tipo_afp : null,
  tipo_comision: esAfp ? values.tipo_comision : null,
  cuspp: esAfp ? values.cuspp : null,
  id_banco_sueldo: values.id_banco_sueldo ?? null,
  nro_cuenta_sueldo: values.id_banco_sueldo ? values.nro_cuenta_sueldo : null,
  cci_sueldo: values.id_banco_sueldo ? values.cci_sueldo : null,
  id_banco_cts: values.id_banco_cts ?? null,
  nro_cuenta_cts: values.id_banco_cts ? values.nro_cuenta_cts : null,
  cci_cts: values.id_banco_cts ? values.cci_cts : null,
  eps_nombre: conEps ? values.eps_nombre : null,
  eps_plan: conEps ? values.eps_plan : null,
  eps_costo_adicional: conEps ? values.eps_costo_adicional : 0,
});

/**
 * Indica si hay que guardar la fecha de filiación en el empleado
 *
 * @remarks
 * Solo con régimen AFP y cuando la fecha es nueva o cambió.
 */
export const filiacionCambio = (
  esAfp: boolean,
  nueva: string | null | undefined,
  actual: string,
): boolean => esAfp && Boolean(nueva) && nueva !== actual;
