import { CrearContratoSchema } from "@jyp/shared-contracts";
import { z } from "zod";

/**
 * Esquema del paso 3 (contrato) del registro de un empleado
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend. Se quita
 * el `empleado_id` porque el empleado aún no existe en este paso.
 */
export const DatosContratoSchema = CrearContratoSchema.omit({
  empleado_id: true,
}).extend({
  // El contrato pone un valor por defecto a `tipo_modalidad` que no está en el catálogo
  tipo_modalidad: z.string().trim().min(1, "Selecciona una modalidad").max(100),
});

/** Datos del paso 3 ya validados */
export type DatosContratoDraft = typeof DatosContratoSchema._output;
