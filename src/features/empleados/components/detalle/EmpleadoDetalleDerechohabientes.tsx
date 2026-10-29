import { Badge } from "@/components/ui/badge";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { VINCULO_OPTIONS } from "../../config/empleados.config";
import { useEmpleadoDerechohabientes } from "../../hooks/useEmpleadoDetalle";
import { DetalleTabEstado } from "./DetalleTabEstado";

interface EmpleadoDetalleDerechohabientesProps {
  empleadoId: string;
}

/**
 * Pestaña Derechohabientes de la ficha: los familiares registrados del empleado
 */
export function EmpleadoDetalleDerechohabientes({
  empleadoId,
}: EmpleadoDetalleDerechohabientesProps) {
  const { data, isLoading, error, refetch } =
    useEmpleadoDerechohabientes(empleadoId);

  return (
    <DetalleTabEstado
      isLoading={isLoading}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data?.length}
      emptyTitle="Sin derechohabientes"
      emptyDescription="Este empleado no tiene familiares registrados."
    >
      <ul className="divide-y rounded-lg border">
        {data?.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {item.nombres} {item.apellidos}
              </p>
              <p className="text-sm text-muted-foreground">
                {getOptionLabel(VINCULO_OPTIONS, item.vinculo)} ·{" "}
                {item.tipo_documento.tipo_documento} {item.nro_documento} ·
                Nació el {formatDate(item.fecha_nacimiento)}
              </p>
            </div>
            <Badge variant="outline">
              {item.acreditado_essalud
                ? "Acreditado en EsSalud"
                : "Sin acreditar en EsSalud"}
            </Badge>
          </li>
        ))}
      </ul>
    </DetalleTabEstado>
  );
}
