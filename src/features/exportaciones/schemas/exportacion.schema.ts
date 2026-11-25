import type { SolicitarExportacionDto } from "@jyp/shared-contracts";
import { z } from "zod/v3";

import { getPeriodoActual } from "@/lib/periodo.utils";
import { CONCEPTOS_PLAME } from "../config/exportaciones.config";
import type { CampoConceptoPlame } from "../types/exportaciones.types";

const ConceptosPlameSchema = z.object({
  recargo_nocturno: z.string(),
  gratificacion: z.string(),
  bonif_extraordinaria: z.string(),
  bono_extraordinario: z.string(),
  descuento_sin_goce: z.string(),
  descuento_dso: z.string(),
  descuento_autorizado: z.string(),
  descuento_eps: z.string(),
});

/** Valores iniciales vacíos para los códigos de la Tabla 22 */
export const CONCEPTOS_PLAME_VACIOS: Record<CampoConceptoPlame, string> = {
  recargo_nocturno: "",
  gratificacion: "",
  bonif_extraordinaria: "",
  bono_extraordinario: "",
  descuento_sin_goce: "",
  descuento_dso: "",
  descuento_autorizado: "",
  descuento_eps: "",
};

/**
 * Esquema del formulario para solicitar una exportación mensual
 */
export const NuevaExportacionFormSchema = z
  .object({
    tipo: z.enum(["COSTOS", "BOLETAS", "PLAME"]),
    periodo: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "El mes debe tener un formato válido")
      .refine(
        (valor) => valor <= getPeriodoActual(),
        "No se pueden exportar planillas de un mes futuro",
      ),
    alcance: z.enum(["TODOS", "COLABORADOR"]),
    empleadoId: z.string().optional(),
    confirmarMontosPagados: z.boolean(),
    conceptosPlame: ConceptosPlameSchema,
  })
  .superRefine((datos, ctx) => {
    if (datos.alcance === "COLABORADOR" && !datos.empleadoId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["empleadoId"],
        message: "Elige un colaborador",
      });
    }

    if (datos.tipo !== "PLAME") return;

    if (!datos.confirmarMontosPagados) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmarMontosPagados"],
        message: "Confirma que los montos del mes ya se pagaron y descontaron",
      });
    }

    for (const { campo } of CONCEPTOS_PLAME) {
      const valor = datos.conceptosPlame[campo].trim();
      if (valor !== "" && !/^\d{4}$/.test(valor)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["conceptosPlame", campo],
          message: "Escribe un código de 4 dígitos",
        });
      }
    }
  });

export type NuevaExportacionDatos = z.output<typeof NuevaExportacionFormSchema>;

/**
 * Arma el DTO de solicitud omitiendo campos opcionales no usados
 */
export const toSolicitarExportacionDto = (
  valores: NuevaExportacionDatos,
  idempotencia: string,
): SolicitarExportacionDto => {
  const conceptos: Partial<Record<CampoConceptoPlame, string>> = {};

  if (valores.tipo === "PLAME") {
    for (const { campo } of CONCEPTOS_PLAME) {
      const codigo = valores.conceptosPlame[campo].trim();
      if (codigo) {
        conceptos[campo] = codigo;
      }
    }
  }

  const configuracion =
    valores.tipo === "PLAME"
      ? {
          confirmar_montos_pagados: true,
          ...(Object.keys(conceptos).length > 0
            ? { conceptos_plame: conceptos }
            : {}),
        }
      : {};

  return {
    tipo: valores.tipo,
    periodo: valores.periodo,
    ...(valores.alcance === "COLABORADOR" && valores.empleadoId?.trim()
      ? { empleado_id: valores.empleadoId.trim() }
      : {}),
    idempotencia,
    configuracion,
  } satisfies SolicitarExportacionDto;
};
