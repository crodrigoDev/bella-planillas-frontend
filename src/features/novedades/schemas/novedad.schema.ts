import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod";

import { zodResolverOptions } from "@/lib/zodMessages.utils";

const REGEX_MONTO = /^\d{1,8}(\.\d{1,4})?$/;

/** Esquema del formulario para registrar una novedad de planilla */
export const RegistrarNovedadSchema = z
  .object({
    tipo: z.enum(
      [
        "BONO_EXTRAORDINARIO_REMUNERATIVO",
        "DESCUENTO_AUTORIZADO",
        "DESCUENTO_DSO",
      ],
      { error: "Elige el tipo de novedad" },
    ),
    monto: z.string().trim(),
    motivo: z
      .string()
      .trim()
      .min(1, "Ingresa el motivo")
      .min(5, "El motivo debe tener al menos 5 caracteres")
      .max(1000, "El motivo no puede superar los 1000 caracteres"),
    referencia_evidencia: z
      .string()
      .trim()
      .min(1, "Ingresa el sustento")
      .min(3, "El sustento debe tener al menos 3 caracteres")
      .max(255, "El sustento no puede superar los 255 caracteres"),
  })
  .superRefine((values, ctx) => {
    const errorMonto = (message: string) =>
      ctx.addIssue({ code: "custom", path: ["monto"], message });

    if (values.monto === "") {
      errorMonto("Ingresa el monto");
      return;
    }

    if (!REGEX_MONTO.test(values.monto)) {
      errorMonto("Ingresa un monto válido con hasta 8 enteros y 4 decimales");
      return;
    }

    if (values.tipo !== "DESCUENTO_DSO" && !/[1-9]/.test(values.monto)) {
      errorMonto("El monto debe ser mayor que cero");
    }
  });

const baseRegistrarResolver = zodResolver(
  RegistrarNovedadSchema,
  zodResolverOptions,
);

/** Valores del formulario de registro antes de validar */
export type RegistrarNovedadValues = Parameters<typeof baseRegistrarResolver>[0];

/** Datos validados del formulario de registro */
export type RegistrarNovedadDatos =
  typeof baseRegistrarResolver extends Resolver<
    RegistrarNovedadValues,
    unknown,
    infer Datos
  >
    ? Datos
    : never;

/** Resolver del formulario para registrar una novedad */
export const registrarNovedadResolver = baseRegistrarResolver;

/** Esquema del motivo obligatorio al aprobar, rechazar o anular una novedad */
export const ResolverNovedadSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(1, "Ingresa el motivo")
    .min(5, "El motivo debe tener al menos 5 caracteres")
    .max(1000, "El motivo no puede superar los 1000 caracteres"),
});

const baseResolverNovedadResolver = zodResolver(
  ResolverNovedadSchema,
  zodResolverOptions,
);

/** Valores del formulario de resolución antes de validar */
export type ResolverNovedadValues = Parameters<
  typeof baseResolverNovedadResolver
>[0];

/** Datos validados del formulario de resolución */
export type ResolverNovedadDatos =
  typeof baseResolverNovedadResolver extends Resolver<
    ResolverNovedadValues,
    unknown,
    infer Datos
  >
    ? Datos
    : never;

/** Resolver del formulario para resolver una novedad */
export const resolverNovedadResolver = baseResolverNovedadResolver;
