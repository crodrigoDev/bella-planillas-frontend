import type {
  ActualizarJornadaDto,
  CrearJornadaDto,
} from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { jornadasService } from "../services/jornadas.service";
import type { Jornada } from "../types/jornadas.types";
import { jornadasKey } from "./useJornadas";

/**
 * Consultas que se refrescan al cambiar una jornada
 *
 * @remarks
 * Además del listado, el catálogo de jornadas que usan empleados y asistencia
 * (`useEmpleadosCatalogos`) para que el selector refleje el cambio.
 */
const INVALIDATE = [jornadasKey.all, [...ROOT_KEYS.catalogos, "jornadas"]];

/** Crea una jornada, avisa y refresca el listado y el catálogo */
export function useCrearJornada() {
  return useMutationConAviso({
    mutationFn: (dto: CrearJornadaDto) => jornadasService.crear(dto),
    successMessage: (_, dto) => `La jornada ${dto.nombre} fue creada.`,
    invalidate: INVALIDATE,
  });
}

/** Edita una jornada, avisa y refresca el listado, su detalle y el catálogo */
export function useEditarJornada(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: ActualizarJornadaDto) => jornadasService.editar(id, dto),
    successMessage: "Los cambios de la jornada se guardaron.",
    invalidate: INVALIDATE,
  });
}

/**
 * Desactiva una jornada, avisa y refresca el listado y el catálogo
 *
 * @remarks
 * No se puede deshacer desde la app: la jornada desaparece del listado.
 */
export function useDesactivarJornada() {
  return useMutationConAviso({
    mutationFn: (jornada: Jornada) => jornadasService.desactivar(jornada.id),
    successMessage: (_, jornada) =>
      `La jornada ${jornada.nombre} fue desactivada.`,
    invalidate: INVALIDATE,
  });
}
