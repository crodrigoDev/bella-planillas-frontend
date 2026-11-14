import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { Button } from "@/components/ui/button";
import type { SelectOption } from "@/lib/types/options.types";
import { useDerechohabientesEmpleado } from "../hooks/useDerechohabientes";
import { DerechohabienteItem } from "./DerechohabienteItem";
import { RegistrarDerechohabienteModal } from "./modals/RegistrarDerechohabienteModal";

interface DerechohabientesEmpleadoProps {
  empleadoId: string;
  /** Si el empleado está de baja, el backend no deja registrar familiares */
  empleadoActivo: boolean;
  /** Tipos de documento; los trae la página, porque el catálogo vive en `empleados` */
  tiposDocumento: SelectOption[] | undefined;
  isLoadingTiposDocumento: boolean;
}

/**
 * Pestaña Derechohabientes de la ficha: los familiares registrados del empleado
 *
 * @remarks
 * Se puede agregar un familiar, adjuntar sus sustentos y quitarlo (el aviso
 * ofrece deshacer). El backend todavía no permite editar sus datos.
 *
 * Los quitados salen en una sección aparte con la opción de reactivar, pero
 * solo cuando el listado los traiga (`activo: false`, mejora DH-F3 del
 * backend); hoy solo llegan los activos. El backend no valida la reactivación,
 * así que aquí se bloquea si el empleado está de baja o si ya hay un activo con
 * el mismo documento.
 */
export function DerechohabientesEmpleado({
  empleadoId,
  empleadoActivo,
  tiposDocumento,
  isLoadingTiposDocumento,
}: DerechohabientesEmpleadoProps) {
  const [registrarOpen, setRegistrarOpen] = useState(false);
  const { data, isLoading, error, refetch } =
    useDerechohabientesEmpleado(empleadoId);

  const activos = data?.filter((d) => d.activo !== false);
  const quitados = data?.filter((d) => d.activo === false);

  const getReactivarDisabledReason = (documento: string) => {
    if (!empleadoActivo) return "El empleado está de baja";
    if (activos?.some((d) => d.nro_documento === documento))
      return "Ya hay un familiar activo con ese documento";
    return undefined;
  };

  return (
    <div className="space-y-4">
      {activos && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {activos.length === 1
              ? "1 derechohabiente"
              : `${activos.length} derechohabientes`}
          </p>
          {empleadoActivo && (
            <Button type="button" onClick={() => setRegistrarOpen(true)}>
              <PlusIcon data-icon="inline-start" />
              Agregar derechohabiente
            </Button>
          )}
        </div>
      )}

      <DetalleTabEstado
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!data?.length}
        emptyTitle="Sin derechohabientes"
        emptyDescription="Este empleado no tiene familiares registrados."
      >
        <div className="space-y-6">
          {activos && activos.length > 0 && (
            <ul className="grid gap-4 lg:grid-cols-2">
              {activos.map((derechohabiente) => (
                <DerechohabienteItem
                  key={derechohabiente.id}
                  derechohabiente={derechohabiente}
                />
              ))}
            </ul>
          )}

          {quitados && quitados.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Quitados
              </h3>
              <ul className="grid gap-4 lg:grid-cols-2">
                {quitados.map((derechohabiente) => (
                  <DerechohabienteItem
                    key={derechohabiente.id}
                    derechohabiente={derechohabiente}
                    quitado
                    reactivarDisabledReason={getReactivarDisabledReason(
                      derechohabiente.nro_documento,
                    )}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      </DetalleTabEstado>

      <RegistrarDerechohabienteModal
        empleadoId={empleadoId}
        tiposDocumento={tiposDocumento}
        isLoadingTiposDocumento={isLoadingTiposDocumento}
        open={registrarOpen}
        onOpenChange={setRegistrarOpen}
      />
    </div>
  );
}
