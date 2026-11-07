import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { LIMITES } from "../config/solicitudes.config";

/** Aprobar: observación opcional y, según el tipo, el efecto en la asistencia */
const AprobarCampos = z.object({
  efecto_asistencia: z.enum(["CON_GOCE", "SIN_GOCE"]).optional(),
  observacion: z
    .string()
    .trim()
    .max(
      LIMITES.observacion.max,
      `La observación no puede pasar de ${LIMITES.observacion.max} caracteres`,
    ),
});

/** Aprobar un tipo que no pide elegir el efecto */
export const AprobarFormSchema = AprobarCampos;

/** Aprobar licencia médica, permiso o justificación: hay que elegir con o sin goce */
export const AprobarConEfectoFormSchema = AprobarCampos.refine(
  (datos) => datos.efecto_asistencia !== undefined,
  { path: ["efecto_asistencia"], message: "Elige si es con o sin goce" },
);

/** Rechazar: el backend exige la observación (5 a 2000 caracteres) */
export const RechazarFormSchema = z.object({
  observacion: z
    .string()
    .trim()
    .min(
      LIMITES.rechazo.min,
      `Explica el motivo en al menos ${LIMITES.rechazo.min} caracteres`,
    )
    .max(
      LIMITES.rechazo.max,
      `El motivo no puede pasar de ${LIMITES.rechazo.max} caracteres`,
    ),
});

/** Anular: el backend exige el motivo (5 a 3000 caracteres) */
export const AnularFormSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(
      LIMITES.anulacion.min,
      `Explica el motivo en al menos ${LIMITES.anulacion.min} caracteres`,
    )
    .max(
      LIMITES.anulacion.max,
      `El motivo no puede pasar de ${LIMITES.anulacion.max} caracteres`,
    ),
});

export const aprobarResolver = zodResolver(
  AprobarFormSchema,
  zodResolverOptions,
);
export const aprobarConEfectoResolver = zodResolver(
  AprobarConEfectoFormSchema,
  zodResolverOptions,
);
export const rechazarResolver = zodResolver(
  RechazarFormSchema,
  zodResolverOptions,
);
export const anularResolver = zodResolver(AnularFormSchema, zodResolverOptions);

/** Valores del formulario de aprobar (los dos esquemas comparten forma) */
export type AprobarValues = Parameters<typeof aprobarResolver>[0];
export type AprobarDatos = typeof AprobarFormSchema._output;
export type RechazarValues = Parameters<typeof rechazarResolver>[0];
export type RechazarDatos = typeof RechazarFormSchema._output;
export type AnularValues = Parameters<typeof anularResolver>[0];
export type AnularDatos = typeof AnularFormSchema._output;
