import { createColumnHelper } from "@tanstack/react-table";
import { PencilIcon, PowerOffIcon } from "lucide-react";

import type { DataTableFeatures } from "@/components/data-table/dataTable.config";
import { AccionButton } from "@/components/page/AccionButton";
import { Badge } from "@/components/ui/badge";
import type { Jornada } from "../types/jornadas.types";
import { formatHoras } from "../utils/jornadas.utils";
import {
  getDuracionLabel,
  getModalidadLabel,
  getTurnoLabel,
} from "./jornadas.config";

const columnHelper = createColumnHelper<DataTableFeatures, Jornada>();

/** Áreas que se escriben en la fila; el resto se resume en "+N" */
const MAX_AREAS_VISIBLES = 2;

/**
 * Columnas de la tabla de jornadas
 *
 * @param handlers.onEditar - Se llama con la fila cuyo botón "Editar" se pulsó
 * @param handlers.onDesactivar - Se llama con la fila cuyo botón "Desactivar" se pulsó
 */
export const getJornadasColumns = ({
  onEditar,
  onDesactivar,
}: {
  onEditar: (jornada: Jornada) => void;
  onDesactivar: (jornada: Jornada) => void;
}) =>
  columnHelper.columns([
    columnHelper.display({
      id: "nombre",
      header: "Jornada",
      cell: ({ row }) => {
        const { nombre, descripcion } = row.original;

        return (
          <div className="flex min-w-0 max-w-72 flex-col">
            <span className="font-medium">{nombre}</span>
            {descripcion && (
              <span className="truncate text-xs text-muted-foreground">
                {descripcion}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "turno",
      header: "Turno",
      cell: ({ row }) => getTurnoLabel(row.original.turno),
    }),
    columnHelper.display({
      id: "modalidad",
      header: "Modalidad",
      cell: ({ row }) => getModalidadLabel(row.original.modalidad),
    }),
    columnHelper.display({
      id: "duracion",
      header: "Duración",
      cell: ({ row }) => getDuracionLabel(row.original.duracion),
    }),
    columnHelper.display({
      id: "horas",
      header: "Horas por semana",
      cell: ({ row }) => formatHoras(row.original.total_horas_semana),
    }),
    columnHelper.display({
      id: "tolerancia",
      header: "Tolerancia",
      cell: ({ row }) => `${row.original.tolerancia_minutos} min`,
    }),
    columnHelper.display({
      id: "areas",
      header: "Áreas",
      cell: ({ row }) => {
        const { areas } = row.original;
        const resto = areas.length - MAX_AREAS_VISIBLES;

        return (
          <div className="flex flex-wrap gap-1">
            {areas.slice(0, MAX_AREAS_VISIBLES).map((area) => (
              <Badge key={area.id} variant="outline">
                {area.nombre}
              </Badge>
            ))}
            {resto > 0 && (
              <Badge
                variant="outline"
                title={areas
                  .slice(MAX_AREAS_VISIBLES)
                  .map((area) => area.nombre)
                  .join(", ")}
              >
                +{resto}
              </Badge>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("total_empleados", { header: "Empleados" }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const jornada = row.original;

        return (
          <div className="flex gap-1.5">
            <AccionButton
              label="Editar"
              icon={PencilIcon}
              onClick={() => onEditar(jornada)}
            />
            <AccionButton
              label="Desactivar"
              icon={PowerOffIcon}
              tone="danger"
              onClick={() => onDesactivar(jornada)}
              disabledReason={
                jornada.total_empleados > 0
                  ? "Tiene empleados activos asignados: reasígnalos antes de desactivarla."
                  : undefined
              }
            />
          </div>
        );
      },
    }),
  ]);
