import {
  EditarContratoSchema,
  RenovarContratoSchema,
} from "@jyp/shared-contracts";

type FechasContrato = { fecha_inicio?: string; fecha_fin?: string | null };

// El backend no valida esto al editar, así que se avisa antes de enviar
const fechaFinValida = ({ fecha_inicio, fecha_fin }: FechasContrato) =>
  !fecha_inicio || !fecha_fin || fecha_inicio <= fecha_fin;

const fechaFinError = {
  message: "La fecha de fin no puede ser anterior a la de inicio.",
  path: ["fecha_fin"],
};

/**
 * Esquema del formulario de edición de un contrato
 *
 * @remarks
 * Parte del esquema compartido, pero sin `estado` ni contrato de origen:
 * el estado lo cambian las acciones (renovar, anular), no el formulario.
 */
export const EditarContratoFormSchema = EditarContratoSchema.omit({
  estado: true,
  contrato_origen_id: true,
}).refine(fechaFinValida, fechaFinError);

/** Esquema del formulario de renovación de un contrato */
export const RenovarContratoFormSchema = RenovarContratoSchema.refine(
  fechaFinValida,
  fechaFinError,
);
