import {
  AsignarJornadaAsistenciaSchema,
  ResolverIncidenciaSchema,
  type ResolverDiaAsistenciaDto,
} from "@jyp/shared-contracts";
import { z } from "zod/v3";

import { toFechaHoraLima } from "../utils/asistencia.utils";

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

const fecha = z
  .string()
  .regex(REGEX_FECHA, "Elige una fecha");
const hora = z.string().regex(REGEX_HORA, "Escribe la hora como HH:mm");
const motivo = z
  .string()
  .trim()
  .min(5, "Explica el motivo en al menos 5 caracteres")
  .max(1000, "El motivo no puede pasar de 1000 caracteres");

/**
 * Formulario de una marcación manual
 *
 * @remarks
 * La fecha y la hora se piden por separado y el servicio las junta con la
 * zona de Lima. El backend rechaza las marcaciones futuras; aquí se avisa antes.
 */
export const MarcacionManualFormSchema = z
  .object({
    fecha,
    hora,
    tipo_marcacion: z.enum([
      "ENTRADA",
      "SALIDA_ALMUERZO",
      "ENTRADA_ALMUERZO",
      "SALIDA",
    ]),
    motivo,
  })
  .refine(
    (datos) =>
      !REGEX_FECHA.test(datos.fecha) ||
      !REGEX_HORA.test(datos.hora) ||
      new Date(toFechaHoraLima(datos.fecha, datos.hora)) <= new Date(),
    { message: "No se pueden registrar marcaciones futuras", path: ["hora"] },
  );

/** Formulario para rechazar o reabrir el resumen de un mes: solo pide el motivo */
export const ResolverResumenFormSchema = ResolverIncidenciaSchema.pick({
  motivo: true,
});

/** Formulario para asignar una jornada, sin el empleado (lo pone la ficha) */
export const AsignarJornadaFormSchema = AsignarJornadaAsistenciaSchema.omit({
  empleado_id: true,
}).refine(
  ({ desde, hasta }) => !hasta || desde <= hasta,
  {
    message: "La fecha final no puede ser anterior a la inicial",
    path: ["hasta"],
  },
);

const horaOpcional = z.string().regex(REGEX_HORA, "Escribe la hora como HH:mm").optional();

/**
 * Formulario para resolver un día
 *
 * @remarks
 * Un solo formulario cubre los tres tipos de decisión del backend; los campos
 * que cada tipo necesita se exigen en el `superRefine`. `toResolverDiaDto`
 * lo convierte en lo que espera el backend.
 */
export const ResolverDiaFormSchema = z
  .object({
    tipo: z.enum(["AUSENCIA", "MARCACIONES", "SOBRETIEMPO"]),
    motivo,
    referencia_evidencia: z
      .string()
      .trim()
      .min(3, "Indica la evidencia en al menos 3 caracteres")
      .max(255, "La evidencia no puede pasar de 255 caracteres"),
    resultado: z
      .enum([
        "FALTA_INJUSTIFICADA",
        "CON_GOCE",
        "SIN_GOCE",
        "INTERRUPCION_TECNICA",
      ])
      .optional(),
    hora_entrada: horaOpcional,
    hora_salida_almuerzo: horaOpcional,
    hora_entrada_almuerzo: horaOpcional,
    hora_salida: horaOpcional,
    reconocer: z.enum(["SI", "NO"]).optional(),
  })
  .superRefine((datos, ctx) => {
    if (datos.tipo === "AUSENCIA" && !datos.resultado)
      ctx.addIssue({
        code: "custom",
        path: ["resultado"],
        message: "Elige cómo se resuelve la ausencia",
      });

    if (datos.tipo === "SOBRETIEMPO" && !datos.reconocer)
      ctx.addIssue({
        code: "custom",
        path: ["reconocer"],
        message: "Elige si se reconoce el sobretiempo",
      });

    if (datos.tipo === "MARCACIONES") {
      const llenas = [
        datos.hora_entrada,
        datos.hora_salida_almuerzo,
        datos.hora_entrada_almuerzo,
        datos.hora_salida,
      ].filter(Boolean);

      if (llenas.length < 2)
        ctx.addIssue({
          code: "custom",
          path: ["hora_entrada"],
          message: "Indica al menos dos marcaciones",
        });
    }
  });

/** Datos del formulario de un día ya validados */
export type ResolverDiaFormDatos = z.output<typeof ResolverDiaFormSchema>;

/**
 * Convierte el formulario de un día en el cuerpo que espera el backend
 *
 * @param empleadoId - Empleado al que pertenece el día
 * @param fecha - Día que se resuelve (YYYY-MM-DD)
 */
export const toResolverDiaDto = (
  datos: ResolverDiaFormDatos,
  empleadoId: string,
  fecha: string,
): ResolverDiaAsistenciaDto => {
  const base = {
    empleado_id: empleadoId,
    fecha,
    motivo: datos.motivo,
    referencia_evidencia: datos.referencia_evidencia,
  };

  if (datos.tipo === "AUSENCIA")
    return {
      ...base,
      tipo: "AUSENCIA",
      resultado: datos.resultado as NonNullable<typeof datos.resultado>,
    };

  if (datos.tipo === "SOBRETIEMPO")
    return { ...base, tipo: "SOBRETIEMPO", reconocer: datos.reconocer === "SI" };

  const marcaciones = (
    [
      ["ENTRADA", datos.hora_entrada],
      ["SALIDA_ALMUERZO", datos.hora_salida_almuerzo],
      ["ENTRADA_ALMUERZO", datos.hora_entrada_almuerzo],
      ["SALIDA", datos.hora_salida],
    ] as const
  )
    .filter(([, hora]) => Boolean(hora))
    .map(([tipo, hora]) => ({ tipo, hora: hora as string }));

  return { ...base, tipo: "MARCACIONES", marcaciones };
};
