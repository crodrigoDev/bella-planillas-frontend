import type { CrearDatoFinancieroDto, DatoFinancieroResponseDto } from "@jyp/shared-contracts";
import type { CrearFinancieroFormSchema, EditarFinancieroFormSchema } from "../schemas/financiero-empleado.schema";

export type CrearFinancieroFormValues = typeof CrearFinancieroFormSchema["_input"];
export type EditarFinancieroFormValues = typeof EditarFinancieroFormSchema["_input"];
export type CrearFinancieroFormDto = typeof CrearFinancieroFormSchema["_output"];
export type EditarFinancieroFormDto = typeof EditarFinancieroFormSchema["_output"];
export type FinancieroFormValues = CrearFinancieroFormValues | EditarFinancieroFormValues;
export type FinancieroMock = CrearDatoFinancieroDto & { id: string; created_at?: string; updated_at?: string };
export type CampoFinancieroSensible = "cuspp" | "nro_cuenta_sueldo" | "cci_sueldo" | "nro_cuenta_cts" | "cci_cts";

// El controlador devuelve las mascaras con estos nombres de campo
export type FinancieroEmpleado = Omit<DatoFinancieroResponseDto, "cuspp_mascara" | "nro_cuenta_sueldo_mascara" | "cci_sueldo_mascara" | "nro_cuenta_cts_mascara" | "cci_cts_mascara"> & {
  cuspp: DatoFinancieroResponseDto["cuspp_mascara"];
  nro_cuenta_sueldo: DatoFinancieroResponseDto["nro_cuenta_sueldo_mascara"];
  cci_sueldo: DatoFinancieroResponseDto["cci_sueldo_mascara"];
  nro_cuenta_cts: DatoFinancieroResponseDto["nro_cuenta_cts_mascara"];
  cci_cts: DatoFinancieroResponseDto["cci_cts_mascara"];
};
