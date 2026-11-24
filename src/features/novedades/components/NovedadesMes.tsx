import { useState } from "react";
import { AlertTriangleIcon, PlusIcon } from "lucide-react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNovedades } from "../hooks/useNovedades";
import type { AccionNovedad, NovedadPlanilla } from "../types/novedades.types";
import {
  contarPendientes,
  getAccionesNovedad,
  hayCambiosDespuesDe,
} from "../utils/novedades.utils";
import { NovedadesTabla } from "./NovedadesTabla";
import { RegistrarNovedadModal } from "./modals/RegistrarNovedadModal";
import { ResolverNovedadModal } from "./modals/ResolverNovedadModal";

interface NovedadesMesProps {
  empleadoId: string;
  periodo: string;
  nombre: string;
  editable: boolean;
  motivoNoEditable?: string;
  /** Fecha del último cálculo de planilla para avisar si hubo cambios posteriores */
  calculadaEn?: string;
  titulo?: string;
}

/**
 * Sección reutilizable con las novedades de un colaborador en un mes y sus acciones
 */
export function NovedadesMes({
  empleadoId,
  periodo,
  nombre,
  editable,
  motivoNoEditable,
  calculadaEn,
  titulo = "Novedades del mes",
}: NovedadesMesProps) {
  const [registroAbierto, setRegistroAbierto] = useState(false);
  const [resolucionAbierta, setResolucionAbierta] = useState(false);
  // Última selección del modal: no se limpia al cerrar para que el diálogo no
  // quede en blanco durante la animación de salida.
  const [resolucion, setResolucion] = useState<{
    novedadId: string;
    accion: AccionNovedad;
  } | null>(null);

  const { data, isLoading, error, refetch } = useNovedades({
    empleadoId,
    periodo,
  });

  const novedades = data ?? [];
  const pendientes = contarPendientes(novedades);
  const aviso = editable
    ? getAvisoNovedades(novedades, pendientes, calculadaEn)
    : null;

  const novedadSeleccionada = resolucion
    ? (novedades.find((item) => item.id === resolucion.novedadId) ?? null)
    : null;
  const accionDisponible =
    novedadSeleccionada !== null &&
    resolucion !== null &&
    getAccionesNovedad(novedadSeleccionada, novedades).some(
      (item) => item.accion === resolucion.accion && item.disponible,
    );

  if (resolucionAbierta && !isLoading && !accionDisponible) {
    setResolucionAbierta(false);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">{titulo}</h2>
            {!isLoading && !error && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                {novedades.length}
              </span>
            )}
          </div>
          {!editable && motivoNoEditable && (
            <p className="text-sm text-muted-foreground">{motivoNoEditable}</p>
          )}
        </div>

        {editable && (
          <Button
            type="button"
            size="sm"
            onClick={() => setRegistroAbierto(true)}
          >
            <PlusIcon data-icon="inline-start" />
            Registrar novedad
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudieron cargar las novedades"
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {aviso && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-soft p-3 text-sm text-warning-soft-foreground"
            >
              <AlertTriangleIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <p>{aviso}</p>
            </div>
          )}

          {novedades.length === 0 ? (
            <EmptyState
              title="Sin novedades en este mes"
              description="Las novedades son bonos extraordinarios o descuentos manuales que se consideran al calcular la planilla."
            />
          ) : (
            <NovedadesTabla
              novedades={novedades}
              editable={editable}
              onResolver={(novedad, accion) => {
                setResolucion({ novedadId: novedad.id, accion });
                setResolucionAbierta(true);
              }}
            />
          )}
        </>
      )}

      <RegistrarNovedadModal
        open={registroAbierto}
        onOpenChange={setRegistroAbierto}
        empleadoId={empleadoId}
        periodo={periodo}
        nombre={nombre}
      />

      <ResolverNovedadModal
        open={resolucionAbierta}
        onOpenChange={setResolucionAbierta}
        novedad={novedadSeleccionada}
        accion={resolucion?.accion ?? null}
      />
    </section>
  );
}

const getAvisoNovedades = (
  novedades: readonly NovedadPlanilla[],
  pendientes: number,
  calculadaEn?: string,
): string | null => {
  if (pendientes > 0) {
    return pendientes === 1
      ? "Hay 1 novedad pendiente. Resuélvela para poder calcular la planilla de este colaborador."
      : `Hay ${pendientes} novedades pendientes. Resuélvelas para poder calcular la planilla de este colaborador.`;
  }

  if (calculadaEn && hayCambiosDespuesDe(novedades, calculadaEn)) {
    return "Hubo cambios en las novedades después del último cálculo. Recalcula la planilla para aplicarlos.";
  }

  return null;
};
