import { CrearContratoSchema } from "@jyp/shared-contracts";

/**
 * Esquema del paso 3 (contrato) del registro de un empleado
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend. Se quitan
 * el `empleado_id` (el empleado aún no existe), el estado y el contrato de
 * origen, que solo aplican a renovaciones.
 */
export const DatosContratoSchema = CrearContratoSchema.omit({
  empleado_id: true,
  estado: true,
  contrato_origen_id: true,
});

/** Datos del paso 3 ya validados */
export type DatosContratoDraft = typeof DatosContratoSchema._output;
