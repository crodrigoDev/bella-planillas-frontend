import type { Contrato } from "../types/contratos.types";

/**
 * Un contrato con PDF adjunto ya no se puede editar
 *
 * @remarks
 * El backend rechaza editar cuando hay PDF, pero no valida el estado.
 */
export const puedeEditar = (contrato: Contrato): boolean =>
  !contrato.tiene_archivo;

/** Solo se adjunta un PDF una vez; no se reemplaza */
export const puedeSubirPdf = (contrato: Contrato): boolean =>
  !contrato.tiene_archivo;

/**
 * El backend solo rechaza renovar un contrato ya renovado o de un empleado
 * inactivo
 */
export const puedeRenovar = (
  contrato: Contrato,
  empleadoActivo: boolean,
): boolean => empleadoActivo && contrato.estado !== "RENOVADO";

/** Saca el nombre del archivo de la ruta que guarda el backend */
export const getNombreArchivo = (url: string): string =>
  url.split("/").pop() ?? url;
