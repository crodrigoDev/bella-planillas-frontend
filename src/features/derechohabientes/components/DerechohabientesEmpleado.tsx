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
 * Se puede agregar un familiar, adjuntar sus sustentos y quitarlo. El backend
 * todavía no permite editar sus datos ni reactivar a uno quitado.
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

  return (
    <div className="space-y-4">
      {data && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {data.length === 1
              ? "1 derechohabiente"
              : `${data.length} derechohabientes`}
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
        <ul className="grid gap-4 lg:grid-cols-2">
          {data?.map((derechohabiente) => (
            <DerechohabienteItem
              key={derechohabiente.id}
              derechohabiente={derechohabiente}
            />
          ))}
        </ul>
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
