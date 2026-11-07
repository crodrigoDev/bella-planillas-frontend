import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod/v3";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  LIMITES,
  MAX_DIAS_VACACIONES,
  TIPOS_CON_FECHAS,
  TIPOS_CON_HORAS,
  TIPOS_CON_MONTO,
  TIPOS_SOLICITUD,
} from "../config/solicitudes.config";

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
/** NUMERIC(12,4) del backend: hasta 8 enteros y 4 decimales */
const REGEX_MONTO = /^\d{1,8}(\.\d{1,4})?$/;
const REGEX_ENTERO = /^\d+$/;

/**
 * Esquema del formulario de una solicitud
 *
 * @remarks
 * Es el contrato de `CrearSolicitudSchema` (motivo de 5 a 1500, observación
 * de hasta 2000, horas juntas y en un solo día) más las reglas que el backend
 * aplica según el tipo. Los números se escriben como texto y se convierten al
 * armar el DTO. Los campos que no aplican al tipo elegido se ignoran, para que
 * un valor que ya no se ve no bloquee el guardado. Con permiso por horas la
 * solicitud es de un solo día: se usa `fecha_inicio` como fecha del día.
 */
export const SolicitudFormSchema = z
  .object({
    empleado_id: z.string().min(1, "Elige un colaborador"),
    tipo: z.enum(TIPOS_SOLICITUD),
    fecha_inicio: z.string(),
    fecha_fin: z.string(),
    por_horas: z.boolean(),
    hora_inicio: z.string(),
    hora_fin: z.string(),
    dias_solicitados: z.string(),
    monto: z.string(),
    motivo: z
      .string()
      .trim()
      .min(
        LIMITES.motivo.min,
        `Explica el motivo en al menos ${LIMITES.motivo.min} caracteres`,
      )
      .max(
        LIMITES.motivo.max,
        `El motivo no puede pasar de ${LIMITES.motivo.max} caracteres`,
      ),
    observacion: z
      .string()
      .trim()
      .max(
        LIMITES.observacion.max,
        `La observación no puede pasar de ${LIMITES.observacion.max} caracteres`,
      ),
  })
  .superRefine((v, ctx) => {
    const error = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (TIPOS_CON_FECHAS.includes(v.tipo)) {
      const porHoras = v.por_horas && TIPOS_CON_HORAS.includes(v.tipo);

      if (!REGEX_FECHA.test(v.fecha_inicio))
        error("fecha_inicio", porHoras ? "Elige el día" : "Elige la fecha de inicio");

      if (porHoras) {
        if (!REGEX_HORA.test(v.hora_inicio))
          error("hora_inicio", "Escribe la hora como HH:mm");

        if (!REGEX_HORA.test(v.hora_fin))
          error("hora_fin", "Escribe la hora como HH:mm");
        else if (REGEX_HORA.test(v.hora_inicio) && v.hora_fin <= v.hora_inicio)
          error("hora_fin", "La hora final debe ser posterior a la inicial");
      } else {
        if (!REGEX_FECHA.test(v.fecha_fin))
          error("fecha_fin", "Elige la fecha de fin");
        else if (
          REGEX_FECHA.test(v.fecha_inicio) &&
          v.fecha_inicio > v.fecha_fin
        )
          error("fecha_fin", "No puede ser anterior a la fecha de inicio");
      }

      const dias = v.dias_solicitados.trim();

      if (dias) {
        if (!REGEX_ENTERO.test(dias) || Number(dias) < 1)
          error("dias_solicitados", "Escribe un número entero de 1 en adelante");
        else if (v.tipo === "VACACIONES" && Number(dias) > MAX_DIAS_VACACIONES)
          error(
            "dias_solicitados",
            `Las vacaciones no pueden pasar de ${MAX_DIAS_VACACIONES} días`,
          );
      }
    }

    if (TIPOS_CON_MONTO.includes(v.tipo)) {
      const monto = v.monto.trim();

      if (!REGEX_MONTO.test(monto) || Number(monto) <= 0)
        error(
          "monto",
          "Escribe un monto mayor a cero, con hasta 4 decimales",
        );
    }
  });

const baseResolver = zodResolver(SolicitudFormSchema, zodResolverOptions);

/** Valores del formulario: lo que escribe el usuario, antes de validar */
export type SolicitudFormValues = Parameters<typeof baseResolver>[0];

/** Datos ya validados, listos para convertir al DTO */
export type SolicitudDatos =
  typeof baseResolver extends Resolver<SolicitudFormValues, unknown, infer Datos>
    ? Datos
    : never;

/** Resolver del formulario de solicitud */
export const solicitudResolver = baseResolver;
