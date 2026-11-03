import { SubirSustentoDerechohabienteSchema } from "@jyp/shared-contracts";

/**
 * Esquema del formulario para adjuntar un sustento
 *
 * @remarks
 * Parte del esquema del contrato, sin el `derechohabiente_id` (lo pone el
 * modal). El archivo no va aquí: se elige aparte. Agrega que el documento no
 * venza antes de su emisión, algo que el backend no comprueba.
 */
export const SustentoFormSchema = SubirSustentoDerechohabienteSchema.omit({
  derechohabiente_id: true,
}).refine(
  ({ fecha_emision, fecha_vencimiento }) =>
    !fecha_emision || !fecha_vencimiento || fecha_emision <= fecha_vencimiento,
  {
    message: "El vencimiento no puede ser anterior a la emisión.",
    path: ["fecha_vencimiento"],
  },
);
