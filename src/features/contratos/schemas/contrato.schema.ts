import {
  CrearContratoSchema,
  EditarContratoSchema,
  RenovarContratoSchema,
} from "@jyp/shared-contracts";
import { z } from "zod";

type FechasContrato = { fecha_inicio?: string; fecha_fin?: string | null };

// El contrato pone un valor por defecto a `tipo_modalidad` que no está en el catálogo
const modalidadObligatoria = {
  tipo_modalidad: z.string().trim().min(1, "Selecciona una modalidad").max(100),
};

// El backend no valida esto al editar, así que se avisa antes de enviar
const fechaFinValida = ({ fecha_inicio, fecha_fin }: FechasContrato) =>
  !fecha_inicio || !fecha_fin || fecha_inicio <= fecha_fin;

const fechaFinError = {
  message: "La fecha de fin no puede ser anterior a la de inicio.",
  path: ["fecha_fin"],
};

/**
 * Esquema del formulario de un contrato nuevo
 *
 * @remarks
 * Sin `empleado_id` (lo pone la ficha).
 */
export const NuevoContratoFormSchema = CrearContratoSchema.omit({
  empleado_id: true,
})
  .extend(modalidadObligatoria)
  .refine(fechaFinValida, fechaFinError);

/**
 * Esquema del formulario de edición de un contrato
 *
 * @remarks
 * Parte del esquema compartido y valida que la fecha de fin no sea anterior
 * a la de inicio antes de enviar.
 */
export const EditarContratoFormSchema = EditarContratoSchema.extend(
  modalidadObligatoria,
).refine(fechaFinValida, fechaFinError);

/** Esquema del formulario de renovación de un contrato */
export const RenovarContratoFormSchema = RenovarContratoSchema.refine(
  fechaFinValida,
  fechaFinError,
);
