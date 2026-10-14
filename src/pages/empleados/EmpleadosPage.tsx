import { FileUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { APP_PREVIEW_MODE } from "@/app/config/app-preview.config";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import EmpleadosFilters from "@/features/empleados/components/EmpleadosFilters";
import EmpleadosTable from "@/features/empleados/components/EmpleadosTable";
import EmpleadosPagination from "@/features/empleados/components/EmpleadosPagination";
import { useEmpleadosListado } from "@/features/empleados/hooks/useEmpleadosListado";
import { AREAS_MOCK, CARGOS_MOCK, JORNADAS_MOCK } from "@/features/empleados/data/empleados.mock";

/** Compone el listado usando la consulta compartida */
export default function EmpleadosPage() {
  const { session } = useAuth();
  const listado = useEmpleadosListado();
  const canManage =
    APP_PREVIEW_MODE ||
    session?.usuario.rol === "ADMIN" ||
    session?.usuario.rol === "RRHH";

  // La respuesta ya incluye las filas de la pagina y el total de su consulta
  const empleados = listado.data?.data ?? [];
  const meta = listado.data?.meta;

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
      {listado.isPending ? (
        <div role="status" className="flex items-center justify-center gap-2 rounded-xl border bg-background py-20 text-sm">
          <Spinner aria-hidden="true" /> Cargando empleados...
        </div>
      ) : listado.isError ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar el listado</AlertTitle>
          <AlertDescription>{getApiErrorMessage(listado.error)}</AlertDescription>
          <Button variant="outline" onClick={() => { void listado.refetch(); }}>
            Reintentar
          </Button>
        </Alert>
      ) : (
        <div>
          <EmpleadosTable
            empleados={empleados}
            canManage={canManage}
            onReset={listado.resetFilters}
          />
          {meta && (
            <EmpleadosPagination
              page={meta.page}
              limit={meta.limit}
              total={meta.total}
              totalPages={Math.max(1, meta.totalPages)}
              onLimitChange={(limit) => listado.changeFilters({ limit })}
              onPageChange={listado.changePage}
            />
          )}
        </div>
      )}
    </section>
  );
}
