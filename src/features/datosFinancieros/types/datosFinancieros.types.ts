/**
 * Régimen de pensión (ONP o SPP) tal como lo guarda el backend
 */
export interface RegimenPension {
  id: string;
  nombre: string;
}

/**
 * Datos financieros de un empleado tal como los devuelve el backend
 *
 * @remarks
 * Los números de cuenta, CCI y CUSPP ya llegan enmascarados. Los nombres
 * no llevan el sufijo `_mascara` que declara `DatoFinancieroResponseSchema`.
 */
export interface DatosFinancieros {
  regimen_nombre: string | null;
  afp_nombre: string | null;
  cuspp: string | null;
  tipo_comision: "FLUJO" | "MIXTA" | null;
  sueldo_basico: number;
  banco_sueldo_nombre: string | null;
  tipo_cuenta_sueldo: string;
  nro_cuenta_sueldo: string | null;
  cci_sueldo: string | null;
  banco_cts_nombre: string | null;
  tipo_cuenta_cts: string;
  nro_cuenta_cts: string | null;
  cci_cts: string | null;
  regimen_salud: string;
  eps_nombre: string | null;
  eps_plan: string | null;
  eps_costo_adicional: number;
}
