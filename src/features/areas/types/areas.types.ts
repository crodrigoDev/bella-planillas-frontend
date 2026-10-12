import type { CrearAreaDto } from "@jyp/shared-contracts";
export type AreaViewModel = Pick<
  CrearAreaDto,
  "nombre" | "descripcion"
> & {
  /** Identificador del registro de ejemplo. */
  id: string;
  /** Cantidad de empleados activos vinculados al área. */
  activeEmployees: number;
  /** Cantidad de cargos activos vinculados al área. */
  activePositions: number;
  /** Cantidad de jornadas asociadas al área. */
  associatedSchedules: number;
  /** Indica si el área está activa. */
  isActive: boolean;
};