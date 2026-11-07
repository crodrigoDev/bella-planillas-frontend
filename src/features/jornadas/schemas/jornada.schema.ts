import { zodResolver } from "@hookform/resolvers/zod";
import { CrearJornadaSchema } from "@jyp/shared-contracts";
import type { Resolver } from "react-hook-form";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  LIMITE_HORAS_TIEMPO_PARCIAL,
  MAX_HORAS_DIA,
  MAX_HORAS_SEMANA,
} from "../config/jornadas.config";
import {
  calcularHorasDia,
  calcularHorasSemana,
  toMinutos,
} from "../utils/jornadas.utils";

/**
 * Esquema del formulario de jornada: el del contrato más las reglas que el backend aplica al guardar
 *
 * @remarks
 * El contrato no exige las horas de un día laborable ni limita las horas, y el
 * backend rechaza lo que pase de 8 h por día, de 48 h por semana o de 30 h en
 * tiempo parcial. Aquí se avisa antes de enviar. Sirve para crear y para
 * editar: al editar se envía la jornada completa.
 */
export const JornadaFormSchema = CrearJornadaSchema.superRefine(
  (jornada, ctx) => {
    jornada.horario_semanal.forEach((dia, index) => {
      if (!dia.laborable) return;

      const campo = (nombre: string) => ["horario_semanal", index, nombre];

      if (toMinutos(dia.entrada) === undefined)
        ctx.addIssue({
          code: "custom",
          path: campo("entrada"),
          message: "Indica la entrada",
        });

      if (toMinutos(dia.salida) === undefined)
        ctx.addIssue({
          code: "custom",
          path: campo("salida"),
          message: "Indica la salida",
        });

      // El backend solo resta el refrigerio si tiene inicio y fin
      const inicio = toMinutos(dia.inicio_descanso);
      const fin = toMinutos(dia.fin_descanso);

      if (inicio === undefined && fin !== undefined)
        ctx.addIssue({
          code: "custom",
          path: campo("inicio_descanso"),
          message: "Indica el inicio",
        });

      if (fin === undefined && inicio !== undefined)
        ctx.addIssue({
          code: "custom",
          path: campo("fin_descanso"),
          message: "Indica el fin",
        });

      if (calcularHorasDia(dia) > MAX_HORAS_DIA)
        ctx.addIssue({
          code: "custom",
          path: campo("salida"),
          message: `Máximo ${MAX_HORAS_DIA} h efectivas`,
        });
    });

    const total = calcularHorasSemana(jornada.horario_semanal);
    const totalError = (message: string) =>
      ctx.addIssue({
        code: "custom",
        path: ["horario_semanal", "root"],
        message,
      });

    if (!jornada.horario_semanal.some((dia) => dia.laborable))
      totalError("Marca al menos un día laborable.");
    else if (total > MAX_HORAS_SEMANA)
      totalError(
        `El total semanal (${total} h) supera el máximo de ${MAX_HORAS_SEMANA} h.`,
      );
    else if (
      jornada.duracion === "TIEMPO_PARCIAL" &&
      total >= LIMITE_HORAS_TIEMPO_PARCIAL
    )
      totalError(
        `El tiempo parcial debe sumar menos de ${LIMITE_HORAS_TIEMPO_PARCIAL} h semanales (ahora ${total} h).`,
      );
  },
);

const baseResolver = zodResolver(JornadaFormSchema, zodResolverOptions);

/** Valores del formulario: lo que escribe el usuario, antes de validar */
export type JornadaFormValues = Parameters<typeof baseResolver>[0];

/** Datos ya validados, listos para convertir al DTO */
export type JornadaDatos =
  typeof baseResolver extends Resolver<JornadaFormValues, unknown, infer Datos>
    ? Datos
    : never;

/**
 * Resolver del formulario de jornada
 *
 * @remarks
 * El patrón de rotación solo cuenta con turno rotativo: con otro turno se
 * descarta antes de validar, para que sus campos (que ya no se ven) no bloqueen el guardado.
 */
export const jornadaResolver: typeof baseResolver = (
  values,
  context,
  options,
) =>
  baseResolver(
    values.turno === "ROTATIVO"
      ? values
      : { ...values, patron_rotacion: undefined },
    context,
    options,
  );
