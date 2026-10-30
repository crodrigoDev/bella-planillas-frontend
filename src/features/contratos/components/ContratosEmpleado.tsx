import { Badge } from "@/components/ui/badge";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { DetalleTabEstado } from "@/components/feedback/DetalleTabEstado";
import { useModalidadesContrato } from "../hooks/useCatalogos";
import { useContratosEmpleado } from "../hooks/useContratos";
import type { Contrato } from "../types/contratos.types";

interface ContratosEmpleadoProps {
  empleadoId: string;
}

const ESTADO_CONTRATO_LABELS: Record<Contrato["estado"], string> = {
  VIGENTE: "Vigente",
  RENOVADO: "Renovado",
  VENCIDO: "Vencido",
  ANULADO: "Anulado",
  FINALIZADO: "Finalizado",
};

const ESTADO_CONTRATO_STYLES: Record<Contrato["estado"], string> = {
  VIGENTE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  RENOVADO: "border-sky-200 bg-sky-50 text-sky-700",
  VENCIDO: "border-red-200 bg-red-50 text-red-700",
  ANULADO: "border-border bg-muted text-muted-foreground",
  FINALIZADO: "border-border bg-muted text-muted-foreground",
};

/**
 * Pestaña Contratos de la ficha: el historial de contratos del empleado
 */
export function ContratosEmpleado({ empleadoId }: ContratosEmpleadoProps) {
  const { data, isLoading, error, refetch } = useContratosEmpleado(empleadoId);
  const modalidades = useModalidadesContrato();

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
          <li
            key={contrato.id}
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {getOptionLabel(modalidades.data, contrato.tipo_modalidad)}
                {contrato.es_prorroga && (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    · Prórroga
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(contrato.fecha_inicio)} al{" "}
                {contrato.fecha_fin
                  ? formatDate(contrato.fecha_fin)
                  : "sin fecha de fin"}
                {contrato.estado === "VIGENTE" &&
                  contrato.dias_restantes !== null &&
                  contrato.dias_restantes >= 0 &&
                  ` · vence en ${contrato.dias_restantes} días`}
              </p>
            </div>
            <Badge
              variant="outline"
              className={ESTADO_CONTRATO_STYLES[contrato.estado]}
            >
              {ESTADO_CONTRATO_LABELS[contrato.estado]}
            </Badge>
          </li>
        ))}
      </ul>
    </DetalleTabEstado>
  );
}
