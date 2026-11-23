import type { ActualizarCargoDto, CrearCargoDto } from "@jyp/shared-contracts";

import { useMutationConAviso } from "@/hooks/useMutationConAviso";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { cargosService } from "../services/cargos.service";
import type { CargoResumenDto } from "../types/cargos.types";
import { cargosKey } from "./useCargos";

/**
 * Consultas que se refrescan al cambiar un cargo
 *
 * @remarks
 * Además del listado, el catálogo de cargos en empleados, el listado de áreas
 * (`total_cargos`), el listado y ficha de colaboradores, contratos globales
 * (columna cargo) y el dashboard RRHH.
 */
const INVALIDATE = [
  cargosKey.all,
  [...ROOT_KEYS.catalogos, "cargos"],
  ROOT_KEYS.areas,
  ROOT_KEYS.empleados,
  ROOT_KEYS.contratos,
  ROOT_KEYS.dashboard,
];

/** Crea un cargo, avisa y refresca las consultas relacionadas */
export function useCrearCargo() {
  return useMutationConAviso({
    mutationFn: (dto: CrearCargoDto) => cargosService.crear(dto),
    successMessage: (_, dto) => `El cargo ${dto.nombre} fue creado.`,
    invalidate: INVALIDATE,
  });
}

/** Edita un cargo, avisa y refresca las consultas relacionadas */
export function useEditarCargo(id: string) {
  return useMutationConAviso({
    mutationFn: (dto: ActualizarCargoDto) => cargosService.editar(id, dto),
    successMessage: "Los cambios del cargo se guardaron.",
    invalidate: INVALIDATE,
  });
}

/**
 * Desactiva un cargo, avisa y refresca las consultas relacionadas
 *
 * @remarks
 * No se puede deshacer desde la app: el cargo desaparece del listado.
 */
export function useDesactivarCargo() {
  return useMutationConAviso({
    mutationFn: (cargo: CargoResumenDto) => cargosService.desactivar(cargo.id),
    successMessage: (_, cargo) => `El cargo ${cargo.nombre} fue desactivado.`,
    invalidate: INVALIDATE,
  });
}
