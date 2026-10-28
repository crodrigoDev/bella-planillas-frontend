import { RegistrarDerechohabienteSchema } from "@jyp/shared-contracts";

/**
 * Esquema de un derechohabiente del paso 4 del registro de un empleado
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend. Se quita
 * el `empleado_id` porque el empleado aún no existe.
 */
export const DatosDerechohabienteSchema = RegistrarDerechohabienteSchema.omit({
  empleado_id: true,
});

/** Derechohabiente del paso 4 ya validado */
export type DerechohabienteDraft = typeof DatosDerechohabienteSchema._output;
