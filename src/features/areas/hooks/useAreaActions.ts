import type { ActualizarAreaDto, CrearAreaDto } from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { areasService } from "../services/areas.service";
import type { AreaResumenDto } from "../types/areas.types";
import { areasKey } from "./useAreas";

/**
 * Consultas que se refrescan al cambiar un área
 *
 * @remarks
 * Además del listado, los catálogos (áreas y cargos que usan empleados,
 * jornadas y contratos), cargos (columna área), el listado de colaboradores,
 * jornadas (columna áreas), contratos globales (columna área) y el dashboard
 * RRHH (distribución por área).
 */
const INVALIDATE = [
  areasKey.all,
  ROOT_KEYS.catalogos,
  ROOT_KEYS.cargos,
  ROOT_KEYS.empleados,
  ROOT_KEYS.jornadas,
  ROOT_KEYS.contratos,
  ROOT_KEYS.dashboard,
];

/** Crea un área, avisa y refresca las consultas relacionadas */
export function useCrearArea() {
  return useMutationConAviso({
    mutationFn: (dto: CrearAreaDto) => areasService.crear(dto),
    successMessage: (_, dto) => `El área ${dto.nombre} fue creada.`,
    invalidate: INVALIDATE,
  });
}

/** Edita un área, avisa y refresca las consultas relacionadas */
export function useEditarArea(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: ActualizarAreaDto) => areasService.editar(id, dto),
    successMessage: "Los cambios del área se guardaron.",
    invalidate: INVALIDATE,
  });
}

/**
 * Desactiva un área, avisa y refresca las consultas relacionadas
 *
 * @remarks
 * No se puede deshacer desde la app: el área desaparece del listado.
 */
export function useDesactivarArea() {
  return useMutationConAviso({
    mutationFn: (area: AreaResumenDto) => areasService.desactivar(area.id),
    successMessage: (_, area) => `El área ${area.nombre} fue desactivada.`,
    invalidate: INVALIDATE,
  });
}
