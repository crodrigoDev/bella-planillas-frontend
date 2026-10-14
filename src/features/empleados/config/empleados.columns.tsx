import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/components/data-table/data-table.config";
import { ESTADOS_LABORALES, REGIMENES_SALUD, TURNOS } from "./empleados.config";
import type { EmpleadoActions, EmpleadoListado } from "../types/empleados.types";
import {
  formatEmpleadoFecha,
  formatEmpleadoSueldo,
  getEmpleadoNombre,
} from "../utils/empleados.utils";
import EmpleadoRowActions from "../components/EmpleadoRowActions";

const columnHelper = createColumnHelper<DataTableFeatures, EmpleadoListado>();
const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

/** Define como se presenta cada dato del empleado dentro del DataTable */
export function getEmpleadosColumns(canManage: boolean, actions: EmpleadoActions) {
  return columnHelper.columns([
    columnHelper.accessor("nombre", {
      header: "Colaborador",
      cell: ({ row }) => {
        const empleado = row.original;
        const name = getEmpleadoNombre(empleado);
        const initials =
          [empleado.nombre?.[0], empleado.apellido?.[0]]
            .filter(Boolean)
            .join("") || "?";
        // Mantiene el color del avatar aunque cambien los filtros o la pagina
        const colorIndex =
          (parseInt(empleado.id.slice(-2), 16) || 0) % avatarColors.length;

        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 after:hidden">
              <AvatarFallback
                className={cn(
                  "text-[10px] font-semibold",
                  avatarColors[colorIndex],
                )}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 max-w-64">
              <p
                className="truncate text-xs font-medium text-foreground"
                title={name}
              >
                {name}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="shrink-0">{empleado.nro_documento}</span>
                <span aria-hidden="true">·</span>
                <span
                  className="max-w-40 truncate"
                  title={empleado.email ?? undefined}
                >
                  {empleado.email ?? "Sin correo"}
                </span>
              </p>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("area.nombre", {
      header: "Área y cargo",
      cell: ({ row }) => (
        <div className="max-w-48">
          <p
            className="truncate font-medium text-foreground"
            title={row.original.area.nombre}
          >
            {row.original.area.nombre}
          </p>
          <p
            className="mt-0.5 truncate text-[11px] text-muted-foreground"
            title={row.original.cargo.nombre}
          >
            {row.original.cargo.nombre}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("jornada_id", {
      header: "Jornada / Turno",
      cell: ({ row }) => {
        const jornada = row.original.jornada;
        return (
          <div>
            <p className="font-medium text-foreground">
              {jornada?.nombre ?? "Sin jornada"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {jornada
                ? (TURNOS[jornada.turno] ?? jornada.turno)
                : "Sin turno asignado"}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor(
      (empleado) => empleado.dato_financiero?.sueldo_basico,
      {
        id: "financiero",
        header: "Sueldo / Salud",
        cell: ({ row }) => {
          const financiero = row.original.dato_financiero;
          return financiero ? (
            <div>
              <p className="font-medium text-foreground">
                {formatEmpleadoSueldo(financiero.sueldo_basico)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {REGIMENES_SALUD[financiero.regimen_salud] ??
                  financiero.regimen_salud}
              </p>
            </div>
          ) : (
            <span className="text-muted-foreground">Sin datos financieros</span>
          );
        },
      },
    ),
    columnHelper.accessor("fecha_inicio", {
      header: "Ingreso",
      cell: ({ row }) => formatEmpleadoFecha(row.original.fecha_inicio),
    }),
    columnHelper.accessor("estado_laboral", {
      header: "Estado / Registro",
      cell: ({ row }) => {
        const state = ESTADOS_LABORALES[row.original.estado_laboral];
        return (
          <div>
            <Badge
              variant="outline"
              className={cn(
                "h-5 gap-1.5 px-2 text-[10px] font-medium",
                state.className,
              )}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-current"
              />
              {state.label}
            </Badge>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {row.original.activo ? "Registro activo" : "Registro inactivo"}
            </p>
          </div>
        );
      },
    }),
    ...(canManage
      ? [
          columnHelper.display({
            id: "acciones",
            header: () => <span className="block text-center">Acciones</span>,
            cell: ({ row }) => (
              <div className="text-center">
                <EmpleadoRowActions empleado={row.original} {...actions} />
              </div>
            ),
          }),
        ]
      : []),
  ]);
}
