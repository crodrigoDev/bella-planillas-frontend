import { formatFechaHoraLima } from "@/lib/date.utils";
import { CAMPOS_OCULTOS } from "../config/auditoria.config";
import type {
  AuditoriaLog,
  AuditoriaValores,
  CambioAuditoria,
} from "../types/auditoria.types";

/** Fecha con hora, como la manda Postgres (`2026-03-05T14:30:00.000Z`) */
const ISO_FECHA_HORA_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/** Fecha sin hora (`2026-03-05`) */
const ISO_FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Calcula qué campos cambiaron en un registro auditado
 *
 * @param antes - Valores anteriores; null en una creación
 * @param despues - Valores nuevos
 * @returns Con valores anteriores, solo los campos que cambian (comparados como
 * JSON); sin ellos, todos los nuevos con `anterior` en null. Los campos
 * técnicos de `CAMPOS_OCULTOS` no se incluyen.
 */
export const getCambiosAuditoria = (
  antes: AuditoriaValores,
  despues: AuditoriaValores,
): CambioAuditoria[] => {
  const nuevos = despues ?? {};
  const anteriores = antes ?? {};
  const campos = antes
    ? Array.from(new Set([...Object.keys(anteriores), ...Object.keys(nuevos)]))
    : Object.keys(nuevos);

  return campos
    .filter((campo) => !CAMPOS_OCULTOS.includes(campo))
    .filter(
      (campo) =>
        !antes ||
        JSON.stringify(anteriores[campo]) !== JSON.stringify(nuevos[campo]),
    )
    .map((campo) => ({
      campo,
      anterior: antes ? (anteriores[campo] ?? null) : null,
      nuevo: nuevos[campo] ?? null,
    }));
};

/**
 * Escribe un valor de la bitácora para leerlo
 *
 * @remarks
 * Nulo es "--", los booleanos son Sí/No, las fechas con hora se pasan a Lima y
 * los objetos y listas se dejan como JSON compacto.
 */
export const formatValorAuditoria = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === "") return "--";
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  if (typeof valor === "string") {
    if (ISO_FECHA_HORA_REGEX.test(valor) && !Number.isNaN(Date.parse(valor)))
      return formatFechaHoraLima(valor);
    if (ISO_FECHA_REGEX.test(valor)) {
      const [year, month, day] = valor.split("-");

      return `${day}/${month}/${year}`;
    }

    return valor;
  }
  if (typeof valor === "object") return JSON.stringify(valor);

  return String(valor);
};

/**
 * Convierte un nombre de columna en texto legible
 *
 * @example formatCampoAuditoria("fecha_inicio") // "Fecha inicio"
 */
export const formatCampoAuditoria = (campo: string): string => {
  const texto = campo.replace(/_/g, " ").trim();

  return texto.charAt(0).toLocaleUpperCase("es-PE") + texto.slice(1);
};

/**
 * Nombre de quien hizo la acción: el del colaborador, el correo si no tiene
 * colaborador y "Sistema" si no hay usuario
 */
export const getUsuarioNombre = (log: AuditoriaLog): string => {
  if (!log.usuarios) return "Sistema";

  const { empleados, email } = log.usuarios;

  return empleados ? `${empleados.nombre} ${empleados.apellido}` : email;
};

/** Primeros 8 caracteres de un id, para mostrarlo en una celda */
export const shortId = (id: string): string => id.slice(0, 8);
