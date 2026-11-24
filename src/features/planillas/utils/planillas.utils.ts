import type {
  AvanceTrabajo,
  EstadoPlanilla,
  EstadoTrabajo,
  TrabajoPlanillas,
} from "../types/planillas.types";

const ESTADOS_TRABAJO_FINALES: readonly EstadoTrabajo[] = [
  "completed",
  "failed",
];

/** Indica si una planilla aún está abierta y puede validarse */
export const esPlanillaValidable = (estado: EstadoPlanilla): boolean =>
  estado === "ABIERTO";

/** Indica si la planilla ya cuenta con boleta disponible para descargar */
export const tieneBoleta = (estado: EstadoPlanilla): boolean =>
  estado === "CONGELADO" || estado === "DECLARADO";

/** Indica si el cálculo ya alcanzó un estado final */
export const esEstadoTrabajoFinal = (estado: EstadoTrabajo): boolean =>
  ESTADOS_TRABAJO_FINALES.includes(estado);

/** Normaliza el progreso recibido a un objeto con los contadores de avance */
export const getAvance = (
  progreso: TrabajoPlanillas["progreso"],
): AvanceTrabajo => {
  if (typeof progreso === "object" && progreso !== null) {
    return progreso;
  }

  return { total: 0, procesados: 0, correctos: 0, fallidos: 0 };
};

/** Extrae el nombre del archivo desde la cabecera `content-disposition` */
export const extraerNombreArchivo = (
  contentDisposition?: string,
  fallback = "boleta.pdf",
): string => {
  if (!contentDisposition) return fallback;

  const utf8Match = /filename\*=UTF-8''([^;\n]+)/i.exec(contentDisposition);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8Match[1].trim();
    }
  }

  const match = /filename="?([^";\n]+)"?/i.exec(contentDisposition);
  return match?.[1]?.trim() || fallback;
};
