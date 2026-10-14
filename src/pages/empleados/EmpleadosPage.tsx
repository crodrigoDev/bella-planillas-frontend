import { FileUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import EmpleadosFilters from "@/features/empleados/components/EmpleadosFilters";
import EmpleadosTable from "@/features/empleados/components/EmpleadosTable";
import { useEmpleadosListado } from "@/features/empleados/hooks/useEmpleadosListado";
import { AREAS_MOCK, CARGOS_MOCK, JORNADAS_MOCK } from "@/features/empleados/data/empleados.mock";

/** Compone la vista de empleados con datos locales */
export default function EmpleadosPage() {
  const { session } = useAuth();
  const listado = useEmpleadosListado();
  const canManage =
    APP_PREVIEW_MODE ||
    session?.usuario.rol === "ADMIN" ||
    session?.usuario.rol === "RRHH";

  return (
    <section aria-labelledby="empleados-title" className="-m-4 min-h-full space-y-6 bg-[#faf9ff] p-4 text-slate-700 dark:bg-background sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="empleados-title" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-foreground">
            Empleados
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Administra la información y situación laboral de los colaboradores
          </p>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 bg-background text-xs text-slate-700"
              disabled
              title="Disponible próximamente"
            >
              <FileUp aria-hidden="true" className="size-3.5" />
              Importar empleados
            </Button>
            <Button className="h-9 px-4 text-xs" disabled title="Disponible próximamente">
              <Plus aria-hidden="true" className="size-3.5" />
              Nuevo empleado
            </Button>
          </div>
        )}
      </div>
      <EmpleadosFilters
        query={listado.query}
        areas={AREAS_MOCK}
        cargos={CARGOS_MOCK}
        jornadas={JORNADAS_MOCK}
        onChange={listado.changeFilters}
        onReset={listado.resetFilters}
      />
      <EmpleadosTable
        empleados={listado.empleados}
        canManage={canManage}
        onReset={listado.resetFilters}
      />
    </section>
  );
}
