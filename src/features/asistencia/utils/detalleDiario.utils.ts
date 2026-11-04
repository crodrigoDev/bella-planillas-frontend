import {
  CheckCircle2Icon,
  CircleAlertIcon,
  ClockIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "@/components/feedback/statusTone.config";
import {
  ALERTA_LABELS,
  ESTADOS_DIA_CON_PROBLEMA,
  ESTADOS_DIA_SIN_RESOLVER,
  ESTADO_DIA,
} from "../config/asistencia.config";
import type { DiaAsistencia, TipoMarca } from "../types/asistencia.types";
import { formatMinutos, humanizarCodigo } from "./asistencia.utils";

/** Orden en que se muestran las marcaciones de un día: E, SA, EA, S */
const ORDEN_MARCAS: TipoMarca[] = [
  "ENTRADA",
  "SALIDA_ALMUERZO",
  "ENTRADA_ALMUERZO",
  "SALIDA",
];

/** Minutos, o un guion si no hay */
export const minutosOGuion = (minutos: number): string =>
  minutos > 0 ? formatMinutos(minutos) : "--";

/** Nombre del estado de un día: "Puntual" o "Tardanza" cuando asistió */
export const getEstadoDia = (
  dia: DiaAsistencia,
): { label: string; tone: StatusTone } => {
  if (dia.estado === "ASISTENCIA_REGISTRADA")
    return dia.minutos_tardanza > 0
      ? { label: "Tardanza", tone: "warning" }
      : { label: "Puntual", tone: "success" };

  return (
    ESTADO_DIA[dia.estado] ?? {
      label: humanizarCodigo(dia.estado),
      tone: "neutral",
    }
  );
};

export interface Decision {
  icon: LucideIcon;
  texto: string;
  tone: StatusTone;
}

/**
 * Qué se ve en "Alertas y decisión" de un día
 *
 * @remarks
 * Prioriza lo que hay que revisar: alertas del backend, falta, tardanza.
 * Si no hay nada que revisar, dice "OK" o el sobretiempo reconocido.
 */
export const getDecisiones = (dia: DiaAsistencia): Decision[] => {
  const decisiones: Decision[] = dia.alertas.map((alerta) => ({
    icon: TriangleAlertIcon,
    texto: ALERTA_LABELS[alerta] ?? humanizarCodigo(alerta),
    tone: "warning",
  }));

  if (dia.estado === "FALTA_INJUSTIFICADA")
    decisiones.push({
      icon: CircleAlertIcon,
      texto: "Falta injustificada",
      tone: "danger",
    });
  else if (dia.estado === "MARCACION_INCOMPLETA")
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: "Marcación incompleta",
      tone: "warning",
    });

  if (dia.estado === "ASISTENCIA_REGISTRADA" && dia.minutos_tardanza > 0)
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: "Tardanza",
      tone: "warning",
    });

  const extras = [
    dia.minutos_extra_25 > 0 && "25%",
    dia.minutos_extra_35 > 0 && "35%",
  ].filter(Boolean);

  if (extras.length)
    decisiones.push({
      icon: ClockIcon,
      texto: `Sobretiempo ${extras.join(" y ")}`,
      tone: "success",
    });

  if (dia.minutos_salida_anticipada > 0)
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: `Salida anticipada de ${formatMinutos(dia.minutos_salida_anticipada)}`,
      tone: "warning",
    });

  if (dia.minutos_sin_goce > 0)
    decisiones.push({
      icon: CircleAlertIcon,
      texto: `Sin goce de ${formatMinutos(dia.minutos_sin_goce)}`,
      tone: "warning",
    });

  if (!decisiones.length && dia.estado === "ASISTENCIA_REGISTRADA")
    decisiones.push({
      icon: CheckCircle2Icon,
      texto: "OK",
      tone: "success",
    });

  return decisiones;
};

/** Marcaciones de un día en orden E, SA, EA, S; las que faltan se muestran vacías */
export const getMarcasEnOrden = (dia: DiaAsistencia) =>
  ORDEN_MARCAS.map((tipo) => ({
    tipo,
    hora: dia.marcas.find((marca) => marca.tipo === tipo)?.hora ?? null,
  }));

/**
 * Banderas de una fila del detalle diario
 *
 * @param hoy - Fecha de hoy como YYYY-MM-DD
 * @param puedeResolver - Si el mes admite resolver días (aprobado, no)
 *
 * @remarks
 * Los días futuros, los descansos y los días fuera del vínculo no se pueden
 * resolver. `accion` es el texto del botón: "Justificar" en una falta,
 * "Resolver" si hay algo que revisar y "Gestionar" en el resto.
 */
export const getFilaDia = (
  dia: DiaAsistencia,
  hoy: string,
  puedeResolver: boolean,
) => {
  const sinTrabajo = ESTADOS_DIA_SIN_RESOLVER.includes(dia.estado);
  const conProblema =
    ESTADOS_DIA_CON_PROBLEMA.includes(dia.estado) ||
    dia.alertas.length > 0 ||
    (dia.estado === "ASISTENCIA_REGISTRADA" && dia.minutos_tardanza > 0);
  const esFalta = dia.estado === "FALTA_INJUSTIFICADA";

  return {
    sinTrabajo,
    conProblema,
    esFalta,
    resoluble: puedeResolver && dia.fecha <= hoy && !sinTrabajo,
    esFuturo: dia.fecha > hoy,
    esHoy: dia.fecha === hoy,
    accion: esFalta ? "Justificar" : conProblema ? "Resolver" : "Gestionar",
  };
};
