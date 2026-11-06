import type { ReactNode } from "react";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/app/routes/path";
import { DataTable } from "@/components/data-table/DataTable";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { erroresTrabajoColumns } from "../../config/cargaMasiva.columns";
import { ESTADO_CARGA_MASIVA } from "../../config/cargaMasiva.config";
import {
  esEstadoFinal,
  useEstadoCargaMasiva,
} from "../../hooks/useCargaMasiva";
import { usePaginacionLocal } from "../../hooks/usePaginacionLocal";
import type {
  CargaMasivaErrorTrabajo,
  CargaMasivaTrabajo,
} from "../../types/cargaMasiva.types";
import { BarraAvance } from "./BarraAvance";

interface ImportarResultadoPasoProps {
  jobId: string;
  /** Quita el trabajo de la URL y vuelve al paso 1 */
  onReiniciar: () => void;
}

const NO_ERRORES: CargaMasivaErrorTrabajo[] = [];

/**
 * Paso 3: avance y resultado de la importación
 *
 * @remarks
 * Consulta el trabajo hasta que termina. Como el id está en la URL, sobrevive a
 * una recarga de la página.
 */
export function ImportarResultadoPaso({
  jobId,
  onReiniciar,
}: ImportarResultadoPasoProps) {
  const { data: trabajo, error, isLoading, refetch } =
    useEstadoCargaMasiva(jobId);

  const reiniciar = (
    <Button type="button" variant="outline" onClick={onReiniciar}>
      Importar otro archivo
    </Button>
  );

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  if (!trabajo) {
    if (isAxiosError(error) && error.response?.status === 404)
      return (
        <EmptyState
          title="No encontramos esta importación"
          description="No existe o la inició otro usuario."
          action={reiniciar}
        />
      );

    return (
      <div className="space-y-3">
        <ErrorAlert
          error={error}
          title="No se pudo consultar la importación"
          onRetry={() => refetch()}
        />
        {reiniciar}
      </div>
    );
  }

  return <ResultadoTrabajo trabajo={trabajo} reiniciar={reiniciar} />;
}

interface ResultadoTrabajoProps {
  trabajo: CargaMasivaTrabajo;
  reiniciar: ReactNode;
}

function ResultadoTrabajo({ trabajo, reiniciar }: ResultadoTrabajoProps) {
  const errores = trabajo.errores_detalle ?? NO_ERRORES;
  const { pagination, onPaginationChange, pageItems, rowCount } =
    usePaginacionLocal(errores);

  const estado = ESTADO_CARGA_MASIVA[trabajo.estado];
  const terminado = esEstadoFinal(trabajo.estado);
  const atendidos = trabajo.procesados + trabajo.fallidos;
  const porcentaje =
    trabajo.total_registros > 0
      ? (atendidos / trabajo.total_registros) * 100
      : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge tone={estado.tone} withDot>
            {estado.label}
          </StatusBadge>
          <span className="text-sm text-muted-foreground">
            {atendidos} de {trabajo.total_registros} filas atendidas
          </span>
        </div>

        <BarraAvance value={porcentaje} label="Avance de la importación" />

        {!terminado && (
          <p className="text-sm text-muted-foreground">
            Puedes salir de esta pantalla: la importación sigue en segundo plano.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Empleados guardados</p>
          <p className="text-2xl font-semibold text-success">
            {trabajo.procesados}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">
            No se pudieron guardar
          </p>
          <p
            className={cn(
              "text-2xl font-semibold",
              trabajo.fallidos > 0 && "text-destructive",
            )}
          >
            {trabajo.fallidos}
          </p>
        </div>
      </div>

      {rowCount > 0 && (
        <section className="space-y-2" aria-labelledby="errores-resultado">
          <h2 id="errores-resultado" className="font-medium">
            Empleados que no se guardaron
          </h2>
          <DataTable
            columns={erroresTrabajoColumns}
            data={pageItems}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={onPaginationChange}
            emptyMessage="No hay errores"
            itemLabel="errores"
          />
        </section>
      )}

      {terminado && (
        <div className="flex flex-wrap justify-end gap-3">
          {reiniciar}
          <Button
            nativeButton={false}
            render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}
          >
            Ver empleados
          </Button>
        </div>
      )}
    </div>
  );
}
