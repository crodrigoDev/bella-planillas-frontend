import type { StatusTone } from "@/components/feedback/statusTone.config";
import {
  formatRangoFechas,
  formatRangoHoras,
} from "@/features/solicitudes/utils/solicitudes.utils";
import { formatFechaHoraLima, toDateInput } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";
import { formatPeriodo } from "@/lib/periodo.utils";
import type {
  KpiDelta,
  SolicitudTramiteResumenDto,
} from "../types/dashboard.types";

/**
 * Devuelve el nombre del mes en español en minúsculas (por ejemplo, "octubre")
 */
export const formatNombreMes = (periodo: string): string =>
  formatPeriodo(periodo).split(" de ")[0];

/**
 * Formatea una fecha YYYY-MM-DD como día y mes corto sin desfase horario ("15 oct")
 */
export const formatDiaMesCorto = (isoDate: string): string => {
  const [year, month, day] = toDateInput(isoDate).split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString("es", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
    .replace(".", "");
};

/**
 * Formatea un día y mes numéricos como "15 de noviembre" sin depender de la zona horaria
 */
export const formatDiaMesLargo = (dia: number, mes: number): string =>
  // Año bisiesto para soportar también el 29 de febrero
  new Date(Date.UTC(2024, mes - 1, dia)).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

/**
 * Devuelve la etiqueta corta del día de la semana ("Lun", "Mar"...) para una fecha YYYY-MM-DD
 */
export const formatDiaSemanaCorto = (isoDate: string): string => {
  const [year, month, day] = toDateInput(isoDate).split("-").map(Number);
  const texto = new Date(Date.UTC(year, month - 1, day))
    .toLocaleDateString("es-PE", { weekday: "short", timeZone: "UTC" })
    .replace(".", "");

  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

/**
 * Extrae hasta dos iniciales en mayúscula a partir del nombre completo
 */
export const getIniciales = (nombre: string): string =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] ?? "")
    .join("")
    .toUpperCase();

/**
 * Formatea un número con hasta dos decimales sin ceros innecesarios y agrega "%"
 */
export const formatPorcentaje = (valor: number, decimales = 2): string =>
  `${Number(valor.toFixed(decimales))}%`;

/**
 * Calcula el texto, tono y tendencia de la diferencia respecto al mes anterior
 */
export const buildKpiDelta = (
  diferencia: number,
  periodoAnterior: string,
  options?: {
    positivoEsBueno?: boolean;
    sufijo?: string;
    decimales?: number;
  },
): KpiDelta => {
  const { positivoEsBueno = true, sufijo, decimales = 0 } = options ?? {};
  const valor = Number(diferencia.toFixed(decimales));
  const mesAnterior = formatNombreMes(periodoAnterior);
  const unidad = sufijo ? ` ${sufijo}` : "";

  if (valor === 0) {
    return {
      texto: `0${unidad} vs. ${mesAnterior}`,
      tone: "neutral",
      tendencia: "igual",
    };
  }

  const signo = valor > 0 ? "+" : "";
  const esFavorable = positivoEsBueno ? valor > 0 : valor < 0;
  const tone: StatusTone = esFavorable ? "success" : "danger";

  return {
    texto: `${signo}${valor}${unidad} vs. ${mesAnterior}`,
    tone,
    tendencia: valor > 0 ? "sube" : "baja",
  };
};

/**
 * Arma la línea de detalle de una solicitud en trámite con el mismo formato del módulo de solicitudes
 */
export const formatDetalleSolicitud = (
  solicitud: SolicitudTramiteResumenDto,
): string => {
  const horas = formatRangoHoras(solicitud.hora_inicio, solicitud.hora_fin);
  const tieneFechas = Boolean(solicitud.fecha_inicio || solicitud.fecha_fin);

  if (horas) {
    return tieneFechas
      ? `${formatRangoFechas(solicitud.fecha_inicio, solicitud.fecha_fin)}, ${horas}`
      : horas;
  }

  if (tieneFechas) {
    const rango = formatRangoFechas(
      solicitud.fecha_inicio,
      solicitud.fecha_fin,
    );

    if (solicitud.dias_solicitados !== null) {
      const unidad = solicitud.dias_solicitados === 1 ? "día" : "días";
      return `${solicitud.dias_solicitados} ${unidad} · ${rango}`;
    }

    return rango;
  }

  if (solicitud.fecha_limite) {
    return `Límite: ${formatDate(solicitud.fecha_limite)}`;
  }

  return `Registrada el ${formatFechaHoraLima(solicitud.created_at)}`;
};

/**
 * Redacta el texto de vencimiento de un contrato a partir de los días restantes
 */
export const formatVencimientoContrato = (diasRestantes: number): string => {
  if (diasRestantes < 0) {
    const dias = Math.abs(diasRestantes);
    return `Venció hace ${dias} ${dias === 1 ? "día" : "días"}`;
  }

  if (diasRestantes === 0) return "Vence hoy";

  return `Vence en ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}`;
};
