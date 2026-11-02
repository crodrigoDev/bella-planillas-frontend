import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { Button } from "@/components/ui/button";
import { useContratosEmpleado } from "../hooks/useContratos";
import { ContratoItem } from "./ContratoItem";
import { NuevoContratoModal } from "./modals/NuevoContratoModal";

interface ContratosEmpleadoProps {
  empleadoId: string;
  /** Si el empleado está de baja, no se puede renovar ni crear contratos */
  empleadoActivo: boolean;
}

/**
 * Pestaña Contratos de la ficha: el historial de contratos del empleado
 *
 * @remarks
 * Los contratos anulados no aparecen: el backend no los devuelve. El botón
 * "Nuevo contrato" solo se ofrece si el empleado está activo y no tiene un
 * contrato vigente; para continuar uno vigente se usa Renovar.
 */
export function ContratosEmpleado({
  empleadoId,
  empleadoActivo,
}: ContratosEmpleadoProps) {
  const [nuevoOpen, setNuevoOpen] = useState(false);
  const { data, isLoading, error, refetch } = useContratosEmpleado(empleadoId);

  const puedeCrear =
    empleadoActivo &&
    data !== undefined &&
    !data.some((contrato) => contrato.estado === "VIGENTE");

  return (
    <div className="space-y-4">
      {puedeCrear && (
        <div className="flex justify-end">
          <Button type="button" onClick={() => setNuevoOpen(true)}>
            <PlusIcon data-icon="inline-start" />
            Nuevo contrato
          </Button>
        </div>
      )}

      <DetalleTabEstado
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!data?.length}
        emptyTitle="Sin contratos"
        emptyDescription="Este empleado todavía no tiene contratos registrados."
      >
        {/* Línea de tiempo: el más reciente arriba; cada renovación continúa al anterior */}
        <ol className="relative space-y-4 before:absolute before:top-6 before:bottom-6 before:left-[6px] before:w-px before:bg-border">
          {data?.map((contrato) => (
            <ContratoItem
              key={contrato.id}
              contrato={contrato}
              empleadoActivo={empleadoActivo}
            />
          ))}
        </ol>
      </DetalleTabEstado>

      <NuevoContratoModal
        empleadoId={empleadoId}
        open={nuevoOpen}
        onOpenChange={setNuevoOpen}
      />
    </div>
  );
}
