import type { AreaResumenDto } from "@jyp/shared-contracts";

import type { PaginationMeta } from "@/lib/api/types/api.types";

export type { AreaResumenDto };

/** Filtros del listado de áreas */
export interface AreaFilters {
  page: number;
  limit: number;
  /** Nombre o descripción */
  search?: string;
}

/** Página de áreas con sus datos de paginación */
export interface AreasPage {
  items: AreaResumenDto[];
  pagination: PaginationMeta;
}
