import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { useContratosEmpleado } from "../hooks/useContratos";
import { ContratoItem } from "./ContratoItem";

interface ContratosEmpleadoProps {
  empleadoId: string;
  /** Si el empleado está de baja, no se puede renovar su contrato */
  empleadoActivo: boolean;
}

/**
 * Pestaña Contratos de la ficha: el historial de contratos del empleado
 *
 * @remarks
 * Los contratos anulados no aparecen: el backend no los devuelve.
 */
export function ContratosEmpleado({
  empleadoId,
  empleadoActivo,
}: ContratosEmpleadoProps) {
  const { data, isLoading, error, refetch } = useContratosEmpleado(empleadoId);

  return (
    <DetalleTabEstado
      isLoading={isLoading}
      error={error}
      onRetry={() => refetch()}
      isEmpty={!data?.length}
      emptyTitle="Sin contratos"
      emptyDescription="Este empleado todavía no tiene contratos registrados."
    >
      <ul className="divide-y rounded-lg border">
        {data?.map((contrato) => (
          <ContratoItem
            key={contrato.id}
            contrato={contrato}
            empleadoActivo={empleadoActivo}
          />
        ))}
      </ul>
    </DetalleTabEstado>
  );
}
