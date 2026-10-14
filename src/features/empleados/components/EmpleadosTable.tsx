import { SearchX } from "lucide-react";
import { cn } from "cn";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ESTADOS_LABORALES,
  REGIMENES_SALUD,
  TURNOS,
} from "../config/empleados.config";
import type { EmpleadoListado } from "../types/empleados.types";
import {
  formatEmpleadoFecha,
  formatEmpleadoSueldo,
  getEmpleadoNombre,
} from "../utils/empleados.utils";
import EmpleadoRowActions from "./EmpleadoRowActions";

interface EmpleadosTableProps {
  empleados: EmpleadoListado[];
  canManage: boolean;
  onReset: () => void;
}

const avatarColors = [
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

/** Agrupa los datos del listado sin agregar contratos que no devuelve la consulta */
export default function EmpleadosTable({
  empleados,
  canManage,
  onReset,
}: EmpleadosTableProps) {
  // El mensaje vacio ocupa la pantalla disponible, incluso en movil
  if (empleados.length === 0) {
    return (
      <div className="rounded-xl border bg-background px-6 py-20 text-center">
        <SearchX
          aria-hidden="true"
          className="mx-auto mb-4 size-8 text-slate-300"
        />
        <p className="text-sm font-medium text-slate-800 dark:text-foreground">
          No se encontraron empleados
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Prueba otra búsqueda o cambia los filtros
        </p>
        <Button variant="outline" className="mt-5" onClick={onReset}>
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-background dark:border-border">
      <div
        className="overflow-x-auto"
        tabIndex={0}
        role="region"
        aria-label="Tabla de empleados"
      >
        <table className="w-full min-w-250 text-left text-xs text-slate-700 dark:text-foreground">
          <caption className="sr-only">
            Listado de empleados y su situación laboral
          </caption>
          <thead className="border-b border-slate-200/70 bg-slate-50/80 text-[11px] font-medium text-slate-600 dark:border-border dark:bg-muted dark:text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-4 font-medium lg:px-5">
                Colaborador
              </th>
              <th scope="col" className="px-3 py-4 font-medium">
                Área y cargo
              </th>
              <th scope="col" className="px-3 py-4 font-medium">
                Jornada laboral / Turno
              </th>
              <th scope="col" className="px-3 py-4 font-medium">
                Sueldo básico / Salud
              </th>
              <th scope="col" className="px-3 py-4 font-medium">
                Fecha de ingreso
              </th>
              <th scope="col" className="px-3 py-4 font-medium">
                Estado laboral / Registro
              </th>
              {canManage && (
                <th scope="col" className="px-3 py-4 text-center font-medium">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-border">
            {empleados.map((empleado, index) => {
              const name = getEmpleadoNombre(empleado);
              const initials =
                [empleado.nombre?.[0], empleado.apellido?.[0]]
                  .filter(Boolean)
                  .join("") || "?";
              const state = ESTADOS_LABORALES[empleado.estado_laboral];
              return (
                <tr
                  key={empleado.id}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-muted/40"
                >
                  <td className="px-4 py-5 lg:px-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 after:hidden">
                        <AvatarFallback
                          className={cn(
                            "text-[11px] font-semibold",
                            avatarColors[index % avatarColors.length],
                          )}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 max-w-56">
                        <p
                          className="truncate font-medium text-slate-900 dark:text-foreground"
                          title={name}
                        >
                          {name}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {empleado.nro_documento}
                        </p>
                        <p
                          className="mt-0.5 truncate text-[11px] text-slate-400"
                          title={empleado.email ?? undefined}
                        >
                          {empleado.email ?? "Sin correo registrado"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-5">
                    <p className="max-w-40 font-medium text-slate-800 dark:text-foreground">
                      {empleado.area.nombre}
                    </p>
                    <p className="mt-1 max-w-40 text-[11px] text-slate-500">
                      {empleado.cargo.nombre}
                    </p>
                  </td>
                  <td className="px-3 py-5">
                    <p className="font-medium text-slate-800 dark:text-foreground">
                      {empleado.jornada?.nombre ?? "Sin jornada"}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {empleado.jornada
                        ? (TURNOS[empleado.jornada.turno] ??
                          empleado.jornada.turno)
                        : "Sin turno asignado"}
                    </p>
                  </td>
                  <td className="px-3 py-5">
                    {empleado.dato_financiero ? (
                      <>
                        <p className="whitespace-nowrap font-medium text-slate-800 dark:text-foreground">
                          {formatEmpleadoSueldo(
                            empleado.dato_financiero.sueldo_basico,
                          )}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {REGIMENES_SALUD[
                            empleado.dato_financiero.regimen_salud
                          ] ?? empleado.dato_financiero.regimen_salud}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">
                        Sin datos financieros
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-5">
                    <span className="inline-block max-w-22">
                      {formatEmpleadoFecha(empleado.fecha_inicio)}
                    </span>
                  </td>
                  <td className="px-3 py-5">
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
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {empleado.activo
                        ? "Registro activo"
                        : "Registro inactivo"}
                    </p>
                  </td>
                  {canManage && (
                    <td className="px-3 py-5 text-center">
                      <EmpleadoRowActions empleado={empleado} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
