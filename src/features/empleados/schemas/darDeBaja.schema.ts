import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";

import { formatDate } from "@/lib/format.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";

interface Opciones {
  /** Fecha de ingreso del empleado (YYYY-MM-DD); vacía si no se conoce */
  fechaInicio: string;
  /** Fecha de hoy (YYYY-MM-DD) */
  hoy: string;
}

/**
 * Esquema del formulario de baja: motivo y último día del vínculo laboral
 *
 * @remarks
 * La fecha no puede ser anterior al ingreso ni posterior a hoy: la baja se aplica
 * al confirmar. Las fechas YYYY-MM-DD se comparan bien como texto.
 */
export const createDarDeBajaSchema = ({ fechaInicio, hoy }: Opciones) =>
  z.object({
    motivo: z
      .string({ required_error: "Selecciona un motivo" })
      .min(1, "Selecciona un motivo"),
    fecha_cese: z
      .string()
      .min(1, "Elige la fecha")
      .superRefine((fecha, ctx) => {
        if (fecha > hoy)
          ctx.addIssue({
            code: "custom",
            message: "La fecha no puede ser posterior a hoy.",
          });
        else if (fechaInicio && fecha < fechaInicio)
          ctx.addIssue({
            code: "custom",
            message: `La fecha no puede ser anterior al ingreso (${formatDate(fechaInicio)}).`,
          });
      }),
  });

/** Resolver de react-hook-form para el formulario de baja, con los mensajes en español */
export const createDarDeBajaResolver = (opciones: Opciones) =>
  zodResolver(createDarDeBajaSchema(opciones), zodResolverOptions);

/** Datos del formulario ya validados */
export type DarDeBajaDatos = ReturnType<
  typeof createDarDeBajaSchema
>["_output"];

/** Valores del formulario antes de validar */
export type DarDeBajaFormValues = Parameters<
  ReturnType<typeof createDarDeBajaResolver>
>[0];
