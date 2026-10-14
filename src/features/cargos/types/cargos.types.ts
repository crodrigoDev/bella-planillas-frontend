import type { CrearCargoDto } from "@jyp/shared-contracts";

// Añade los campos que el listado de cargos devuelve junto al contrato de creacion
export type CargoListado = CrearCargoDto & {
  id: string;
  activo: boolean;
  area: { id: string; nombre: string };
  total_empleados: number;
};
