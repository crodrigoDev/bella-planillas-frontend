import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { TipoMarcacion } from "@jyp/shared-contracts";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import DataTable from "@/components/data-table/DataTable";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import {
  formatEmpleadoFecha,
  getEmpleadoNombre,
} from "@/features/empleados/utils/empleados.utils";
import { formatMarcacionHora } from "@/features/empleados/utils/ficha-empleado.utils";
import { formatMinutosNetos } from "@/features/empleados/utils/asistencia-diaria.utils";
import { ESTADOS_ASISTENCIA_DIARIA } from "../config/asistencia-diaria.config";
import type { AsistenciaRegistro } from "../types/asistencia-diaria.types";

const column = createColumnHelper<DataTableFeatures, AsistenciaRegistro>();

/** Muestra el horario esperado y conserva todas las marcas en el detalle */
export default function AsistenciaDiariaTable({
  data,
  showDate,
  onDetail,
}: {
  data: AsistenciaRegistro[];
  showDate: boolean;
  onDetail: (row: AsistenciaRegistro) => void;
}) {
  const columns = column.columns([
    column.display({
      id: "empleado",
      header: "Empleado",
      cell: ({ row: { original: row } }) => (
        <div className="flex min-w-52 items-center gap-3">
          <Avatar aria-hidden className="size-8 shrink-0 after:hidden">
            <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
              {[
                row.empleado.nombre?.charAt(0),
                row.empleado.apellido?.charAt(0),
              ]
                .filter(Boolean)
                .join("") || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              to={`/empleados/${row.empleado.id}`}
              className="font-medium hover:text-primary"
            >
              {getEmpleadoNombre(row.empleado)}
            </Link>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {row.empleado.nro_documento} · {row.empleado.area.nombre}
            </p>
            {showDate && (
              <p className="mt-1 text-[10px] text-muted-foreground">
                {formatEmpleadoFecha(row.fecha)}
              </p>
            )}
          </div>
        </div>
      ),
    }),
    column.display({
      id: "jornada",
      header: "Jornada esperada",
      cell: ({ row: { original: row } }) => (
        <div className="min-w-44">
          <p className="font-medium">
            {row.jornada?.nombre ?? "Sin jornada asignada"}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {row.horario?.laborable
              ? `${row.horario.entrada?.slice(0, 5) ?? "—"} – ${row.horario.salida?.slice(0, 5) ?? "—"} · Tol. ${row.jornada?.tolerancia_minutos ?? 5} min`
              : row.horario
                ? "Día de descanso"
                : "Sin horario"}
          </p>
          {row.horario?.laborable &&
            row.horario.inicio_descanso &&
            row.horario.fin_descanso && (
              <p className="mt-1 text-[10px] text-muted-foreground">
                Descanso {row.horario.inicio_descanso.slice(0, 5)} –{" "}
                {row.horario.fin_descanso.slice(0, 5)}
              </p>
            )}
        </div>
      ),
    }),
    column.display({
      id: "entrada",
      header: "Entrada",
      cell: ({ row: { original: row } }) => {
        const entrada = row.marcaciones.find(
          (item) => item.tipo_marcacion === TipoMarcacion.ENTRADA,
        );
        return (
          <div className="min-w-24">
            <p className="font-medium tabular-nums">
              {entrada ? formatMarcacionHora(entrada.fecha_hora) : "—"}
            </p>
            {row.resultado.minutos_tardanza > 0 && (
              <p className="mt-1 text-[10px] text-amber-700">
                {row.resultado.minutos_tardanza} min de retraso
              </p>
            )}
          </div>
        );
      },
    }),
    column.display({
      id: "salida",
      header: "Salida",
      cell: ({ row: { original: row } }) => {
        const salida = row.marcaciones.findLast(
          (item) => item.tipo_marcacion === TipoMarcacion.SALIDA,
        );
        return (
          <span className="font-medium tabular-nums">
            {salida ? formatMarcacionHora(salida.fecha_hora) : "—"}
          </span>
        );
      },
    }),
    column.display({
      id: "horas",
      header: "Horas netas",
      cell: ({ row: { original: row } }) => (
        <span className="whitespace-nowrap font-medium tabular-nums">
          {row.resultado.minutos_netos !== null
            ? formatMinutosNetos(row.resultado.minutos_netos)
            : "—"}
        </span>
      ),
    }),
    column.display({
      id: "resultado",
      header: "Resultado",
      cell: ({ row: { original: row } }) => {
        const estado = ESTADOS_ASISTENCIA_DIARIA[row.resultado.estado];
        return (
          <Badge
            variant="outline"
            className={`gap-1.5 text-[10px] ${estado.className}`}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {estado.label}
          </Badge>
        );
      },
    }),
    column.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row: { original: row } }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Ver registros de ${getEmpleadoNombre(row.empleado)} del ${formatEmpleadoFecha(row.fecha)}`}
          onClick={() => onDetail(row)}
        >
          <Eye aria-hidden className="size-3.5 text-muted-foreground" />
        </Button>
      ),
    }),
  ]);
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      caption="Asistencia diaria en hora de Perú"
    />
  );
}
