import type { CargoResumenDto } from "@jyp/shared-contracts";

import type { PaginationMeta } from "@/lib/api/types/api.types";

export type { CargoResumenDto };

/** Filtros del listado de cargos */
export interface CargoFilters {
  page: number;
  limit: number;
  /** Nombre o descripción */
  search?: string;
  /** Id del área */
  id_area?: string;
}

/** Página de cargos con sus datos de paginación */
export interface CargosPage {
  items: CargoResumenDto[];
  pagination: PaginationMeta;
}
