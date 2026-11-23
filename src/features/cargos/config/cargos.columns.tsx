import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, PowerOffIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { AccionButton } from "@/components/page/AccionButton";
import { orDash } from "@/lib/format.utils";
import type { CargoResumenDto } from "../types/cargos.types";
import { formatBandaSalarial } from "../utils/cargos.utils";

const columnHelper = createColumnHelper<DataTableFeatures, CargoResumenDto>();

const getMotivoBloqueoDesactivar = (
  cargo: CargoResumenDto,
): string | undefined => {
  if (cargo.total_empleados <= 0) return undefined;

  const detalle =
    cargo.total_empleados === 1
      ? "1 colaborador activo"
      : `${cargo.total_empleados} colaboradores activos`;

  return `Tiene ${detalle}. Reasígnalos antes de desactivar el cargo.`;
};

/**
 * Columnas de la tabla de cargos
 *
 * @param handlers.onEditar - Se llama con la fila cuyo botón "Editar" se pulsó
 * @param handlers.onDesactivar - Se llama con la fila cuyo botón "Desactivar" se pulsó
 */
export const getCargosColumns = ({
  onEditar,
  onDesactivar,
}: {
  onEditar: (cargo: CargoResumenDto) => void;
  onDesactivar: (cargo: CargoResumenDto) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "nombre",
      header: "Cargo",
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
    columnHelper.display({
      id: "area",
      header: "Área",
      cell: ({ row }) => orDash(row.original.area?.nombre),
    }),
    columnHelper.display({
      id: "banda_salarial",
      header: "Banda salarial",
      cell: ({ row }) =>
        formatBandaSalarial(
          row.original.sueldo_minimo,
          row.original.sueldo_maximo,
        ),
    }),
    columnHelper.accessor("total_empleados", {
      header: "Colaboradores activos",
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const cargo = row.original;

        return (
          <div className="flex gap-1.5">
            <AccionButton
              label="Editar"
              icon={PencilIcon}
              onClick={() => onEditar(cargo)}
            />
            <AccionButton
              label="Desactivar"
              icon={PowerOffIcon}
              tone="danger"
              onClick={() => onDesactivar(cargo)}
              disabledReason={getMotivoBloqueoDesactivar(cargo)}
            />
          </div>
        );
      },
    }),
  ]);
