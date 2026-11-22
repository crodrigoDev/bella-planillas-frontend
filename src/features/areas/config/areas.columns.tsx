import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, PowerOffIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { AccionButton } from "@/components/page/AccionButton";
import type { AreaResumenDto } from "../types/areas.types";

const columnHelper = createColumnHelper<DataTableFeatures, AreaResumenDto>();

const getMotivoBloqueoDesactivar = (
  area: AreaResumenDto,
): string | undefined => {
  const motivos: string[] = [];

  if (area.total_empleados > 0) {
    motivos.push(
      area.total_empleados === 1
        ? "1 colaborador activo"
        : `${area.total_empleados} colaboradores activos`,
    );
  }

  if (area.total_cargos > 0) {
    motivos.push(
      area.total_cargos === 1
        ? "1 cargo activo"
        : `${area.total_cargos} cargos activos`,
    );
  }

  if (motivos.length === 0) return undefined;

  return `Tiene ${motivos.join(" y ")}. Reasígnalos antes de desactivar el área.`;
};

/**
 * Columnas de la tabla de áreas
 *
 * @param handlers.onEditar - Se llama con la fila cuyo botón "Editar" se pulsó
 * @param handlers.onDesactivar - Se llama con la fila cuyo botón "Desactivar" se pulsó
 */
export const getAreasColumns = ({
  onEditar,
  onDesactivar,
}: {
  onEditar: (area: AreaResumenDto) => void;
  onDesactivar: (area: AreaResumenDto) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "nombre",
      header: "Nombre",
      cell: ({ row }) => {
        const { nombre, descripcion } = row.original;

        return (
          <div className="flex min-w-0 max-w-80 flex-col">
            <span className="font-medium">{nombre}</span>
            <span
              className="truncate text-xs text-muted-foreground"
              title={descripcion || undefined}
            >
              {descripcion || "Sin descripción"}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("total_empleados", {
      header: "Colaboradores activos",
    }),
    columnHelper.accessor("total_cargos", {
      header: "Cargos activos",
    }),
    columnHelper.accessor("total_jornadas", {
      header: "Jornadas",
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const area = row.original;

        return (
          <div className="flex gap-1.5">
            <AccionButton
              label="Editar"
              icon={PencilIcon}
              onClick={() => onEditar(area)}
            />
            <AccionButton
              label="Desactivar"
              icon={PowerOffIcon}
              tone="danger"
              onClick={() => onDesactivar(area)}
              disabledReason={getMotivoBloqueoDesactivar(area)}
            />
          </div>
        );
      },
    }),
  ]);
