import { orDash } from "@/lib/format.utils";
import type {
  AvanceTrabajo,
  CabeceraPlanilla,
  EstadoPlanilla,
  EstadoTrabajo,
  PlanillaDetalle,
  TrabajoPlanillas,
} from "../types/planillas.types";

const ESTADOS_TRABAJO_FINALES: readonly EstadoTrabajo[] = [
  "completed",
  "failed",
];

const CABECERA_VACIA: CabeceraPlanilla = {
  nombre_completo: null,
  nro_documento: null,
  cargo: null,
  area: null,
  asignacion_familiar: null,
  regimen_pension: null,
};

const readString = (obj: Record<string, unknown>, key: string): string | null => {
  const value = obj[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
};

const readBoolean = (
  obj: Record<string, unknown>,
  key: string,
): boolean | null => {
  const value = obj[key];
  return typeof value === "boolean" ? value : null;
};

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

/**
 * Lee de forma defensiva la cabecera del colaborador desde `snapshot_calculo`
 *
 * @remarks
 * `snapshot_calculo` es un dato interno del backend sin contrato compartido:
 * todos los campos pueden faltar o cambiar, por eso cada propiedad se valida y
 * devuelve `null` ante cualquier inconsistencia sin lanzar errores.
 */
export const getCabeceraPlanilla = (snapshot: unknown): CabeceraPlanilla => {
  if (typeof snapshot !== "object" || snapshot === null) {
    return CABECERA_VACIA;
  }

  const raw = (snapshot as Record<string, unknown>).cabecera;
  if (typeof raw !== "object" || raw === null) {
    return CABECERA_VACIA;
  }

  const cabecera = raw as Record<string, unknown>;

  return {
    nombre_completo: readString(cabecera, "nombre_completo"),
    nro_documento: readString(cabecera, "nro_documento"),
    cargo: readString(cabecera, "cargo"),
    area: readString(cabecera, "area"),
    asignacion_familiar: readBoolean(cabecera, "asignacion_familiar"),
    regimen_pension: readString(cabecera, "regimen_pension"),
  };
};

/**
 * Determina si la planilla corresponde al régimen ONP con la misma regla de la boleta
 */
export const esRegimenOnp = (
  planilla: Pick<PlanillaDetalle, "tasa_afp_aplicada" | "descuento_onp">,
  cabecera?: CabeceraPlanilla,
): boolean => {
  const regimen = cabecera?.regimen_pension?.toUpperCase() ?? "";

  return (
    regimen.includes("ONP") ||
    (planilla.tasa_afp_aplicada === null && Number(planilla.descuento_onp) > 0)
  );
};

/** Formatea la tasa AFP aplicada como porcentaje legible */
export const formatTasaAfp = (tasa: string | null): string => {
  if (!tasa) return orDash(null);

  const num = Number(tasa);
  if (!Number.isFinite(num) || num === 0) return orDash(null);

  const porcentaje = num < 1 ? num * 100 : num;
  return `${porcentaje.toFixed(2)} %`;
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
