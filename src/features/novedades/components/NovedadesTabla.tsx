import { DataTable } from "@/components/data-table/DataTable";
import { getNovedadesColumns } from "../config/novedades.columns";
import type { AccionNovedad, NovedadPlanilla } from "../types/novedades.types";

interface NovedadesTablaProps {
  novedades: readonly NovedadPlanilla[];
  editable: boolean;
  onResolver: (novedad: NovedadPlanilla, accion: AccionNovedad) => void;
}

/**
 * Muestra las novedades del mes en la tabla estándar del sistema
 */
export function NovedadesTabla({
  novedades,
  editable,
  onResolver,
}: NovedadesTablaProps) {
  const columns = getNovedadesColumns({
    novedades,
    editable,
    onResolver,
  });

  return (
    <DataTable
      columns={columns}
      data={novedades}
      emptyMessage="Sin novedades en este mes"
    />
  );
}
