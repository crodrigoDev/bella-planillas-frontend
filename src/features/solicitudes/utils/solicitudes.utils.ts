import { getTodayIsoDate, parseIsoDate } from "@/lib/date.utils";
import { formatCurrency, formatDate } from "@/lib/format.utils";
import type { StatusTone } from "@/components/feedback/statusTone.config";
import {
  getEstadoLabel,
  TIPOS_CON_DIAS,
  TIPOS_CON_FECHAS,
  TIPOS_CON_HORAS,
  TIPOS_CON_MONTO,
  TIPOS_EFECTO_ELEGIBLE,
} from "../config/solicitudes.config";
import type { SolicitudDatos } from "../schemas/solicitud.schema";
import type {
  AccionesSolicitud,
  EfectoAsistencia,
  EstadoSolicitud,
  NuevaSolicitudDto,
  SolicitudResponsable,
  TipoSolicitud,
} from "../types/solicitudes.types";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Una solicitud que todavía se puede tomar, evaluar o anular */
export const estaAbierta = (estado: EstadoSolicitud): boolean =>
  estado === "PENDIENTE" || estado === "EN_REVISION";

/**
 * Indica qué acciones se pueden hacer sobre una solicitud
 *
 * @param solicitud - Estado y responsable de la solicitud
 * @param userId - Id del usuario de la sesión (el responsable es un usuario)
 * @returns Por acción, `null` si se puede o el motivo por el que no
 *
 * @remarks
 * Replica las reglas del backend: tomar solo si está pendiente; aprobar y
 * rechazar solo si está en revisión y el usuario es el responsable (no hay
 * forma de soltarla ni reasignarla); anular solo si sigue abierta.
 */
export const getAccionesSolicitud = (
  solicitud: {
    estado: EstadoSolicitud;
    responsable: SolicitudResponsable | null;
  },
  userId: string | undefined,
): AccionesSolicitud => {
  const { estado, responsable } = solicitud;
  const cerrada = `La solicitud ya está ${getEstadoLabel(estado).toLowerCase()}.`;
  const esResponsable = Boolean(userId) && responsable?.id === userId;

  let tomar: string | null = null;
  let evaluar: string | null = null;

  if (!estaAbierta(estado)) {
    tomar = cerrada;
    evaluar = cerrada;
  } else if (estado === "PENDIENTE") {
    evaluar = "Primero toma la solicitud para poder evaluarla.";
  } else if (esResponsable) {
    tomar = "Ya tomaste esta solicitud: puedes evaluarla.";
  } else {
    tomar = `La solicitud ya la tomó ${responsable?.nombre_completo ?? "otro usuario"}.`;
    evaluar = `Solo ${responsable?.nombre_completo ?? "quien la tomó"} puede evaluarla.`;
  }

  return {
    tomar,
    aprobar: evaluar,
    rechazar: evaluar,
    anular: estaAbierta(estado)
      ? null
      : "Solo se pueden anular solicitudes pendientes o en revisión.",
  };
};

/** El tipo pide elegir si el tiempo es con o sin goce al aprobar */
export const requiereEfectoAsistencia = (tipo: TipoSolicitud): boolean =>
  TIPOS_EFECTO_ELEGIBLE.includes(tipo);

/**
 * Efecto en la asistencia que se envía al aprobar
 *
 * @param elegido - Lo que eligió RRHH (solo cuenta si el tipo lo pide)
 * @returns `CON_GOCE` para vacaciones (el motor las trata así), lo elegido
 * para licencia médica, permiso y justificación, y `undefined` para el resto
 *
 * @remarks
 * Para el resto no se envía nada: la base de datos solo admite
 * `PENDIENTE_DEFINIR`, `CON_GOCE`, `SIN_GOCE` y `SUBSIDIO`, y rechaza
 * `NO_APLICA` con un error 500.
 */
export const getEfectoAprobacion = (
  tipo: TipoSolicitud,
  elegido: EfectoAsistencia | undefined,
): EfectoAsistencia | undefined => {
  if (tipo === "VACACIONES") return "CON_GOCE";

  return requiereEfectoAsistencia(tipo) ? elegido : undefined;
};

/**
 * Cuenta los días de calendario entre dos fechas, ambas incluidas
 *
 * @returns Los días, o `undefined` si falta una fecha o el rango está al revés
 *
 * @remarks
 * Cuenta todos los días (también sábados y domingos): es solo una sugerencia
 * que RRHH puede cambiar.
 */
export const calcularDias = (
  inicio: string | undefined,
  fin: string | undefined,
): number | undefined => {
  const desde = parseIsoDate(inicio);
  const hasta = parseIsoDate(fin);

  if (!desde || !hasta || Number.isNaN(desde.getTime()) || Number.isNaN(hasta.getTime()))
    return undefined;

  const dias = Math.round((hasta.getTime() - desde.getTime()) / MS_POR_DIA) + 1;

  return dias >= 1 ? dias : undefined;
};

/**
 * Convierte lo validado del formulario en el cuerpo que espera el backend
 *
 * @remarks
 * Solo incluye lo que aplica al tipo. Con permiso por horas la fecha de fin
 * es la misma de inicio. Lo vacío no se envía, salvo los días, que se
 * calculan desde las fechas si no se escribieron.
 */
export const toSolicitudDto = (datos: SolicitudDatos): NuevaSolicitudDto => {
  const { tipo } = datos;
  const dto: NuevaSolicitudDto = {
    empleado_id: datos.empleado_id,
    tipo,
    motivo: datos.motivo,
    observacion: datos.observacion || undefined,
  };

  const porHoras =
    datos.por_horas &&
    TIPOS_CON_FECHAS.includes(tipo) &&
    TIPOS_CON_HORAS.includes(tipo);

  if (TIPOS_CON_FECHAS.includes(tipo)) {
    dto.fecha_inicio = datos.fecha_inicio;
    dto.fecha_fin = porHoras ? datos.fecha_inicio : datos.fecha_fin;

    if (porHoras) {
      dto.hora_inicio = datos.hora_inicio;
      dto.hora_fin = datos.hora_fin;
    }
  }

  const dias = datos.dias_solicitados.trim();

  // Por horas no hay días: el campo no se ve y puede quedar con un valor viejo.
  // Sin días escritos se envía el cálculo desde las fechas.
  if (TIPOS_CON_DIAS.includes(tipo) && !porHoras)
    dto.dias_solicitados = dias
      ? Number(dias)
      : calcularDias(dto.fecha_inicio, dto.fecha_fin);

  if (TIPOS_CON_MONTO.includes(tipo)) dto.monto = Number(datos.monto);

  return dto;
};

/**
 * Escribe el rango de fechas de una solicitud
 *
 * @example formatRangoFechas("2026-03-01", "2026-03-05") // "01/03/2026 - 05/03/2026"
 * @returns Una sola fecha si inicio y fin coinciden, o un guion si no hay fechas
 */
export const formatRangoFechas = (
  inicio: string | null | undefined,
  fin: string | null | undefined,
): string => {
  if (!inicio && !fin) return "--";
  if (!fin || !inicio || inicio.slice(0, 10) === fin.slice(0, 10))
    return formatDate(inicio ?? fin);

  return `${formatDate(inicio)} - ${formatDate(fin)}`;
};

/** Escribe un tramo de horas ("08:00 - 12:00"), o `null` si no hay horas */
export const formatRangoHoras = (
  inicio: string | null | undefined,
  fin: string | null | undefined,
): string | null => (inicio && fin ? `${inicio} - ${fin}` : null);

/**
 * Resume el periodo o el monto de una solicitud para el listado y el detalle
 *
 * @returns El monto en soles, las fechas (con las horas si las hay) o un guion
 */
export const formatPeriodoSolicitud = (solicitud: {
  tipo: TipoSolicitud;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  monto: string | null;
}): string => {
  if (TIPOS_CON_MONTO.includes(solicitud.tipo) && solicitud.monto !== null)
    return formatCurrency(Number(solicitud.monto));

  const fechas = formatRangoFechas(solicitud.fecha_inicio, solicitud.fecha_fin);
  const horas = formatRangoHoras(solicitud.hora_inicio, solicitud.hora_fin);

  return horas ? `${fechas}, ${horas}` : fechas;
};

/**
 * Color con que se resalta la fecha límite de una solicitud abierta
 *
 * @returns `danger` si el plazo ya pasó, `warning` si vence hoy, y `undefined`
 * si no hay que resaltar (cerrada, sin plazo o aún a tiempo)
 */
export const getTonoFechaLimite = (
  solicitud: { estado: EstadoSolicitud; fecha_limite: string | null },
  hoy: string = getTodayIsoDate(),
): StatusTone | undefined => {
  if (!solicitud.fecha_limite || !estaAbierta(solicitud.estado)) return undefined;

  const limite = solicitud.fecha_limite.slice(0, 10);

  if (limite < hoy) return "danger";
  if (limite === hoy) return "warning";

  return undefined;
};

/**
 * Escribe una fecha y hora con la zona de Lima, por ejemplo "05/03/2026, 14:30"
 *
 * @param iso - Instante completo con zona (el historial y `created_at`)
 */
export const formatFechaHoraLima = (iso: string): string =>
  new Date(iso).toLocaleString("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
