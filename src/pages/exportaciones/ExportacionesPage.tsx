import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/page/PageHeader";
import { NuevaExportacionForm } from "@/features/exportaciones/components/formulario/NuevaExportacionForm";
import { ExportacionResultado } from "@/features/exportaciones/components/resultado/ExportacionResultado";
import { useEmpleadosBusqueda } from "@/features/planillas/hooks/useEmpleadosOpciones";
import { getPeriodoActual, parsePeriodo } from "@/lib/periodo.utils";
import { applyParamChanges, parseUuid } from "@/lib/urlParams.utils";

/**
 * Página para generar exportaciones mensuales de costos, boletas por correo y PLAME
 */
export default function ExportacionesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ultimaSolicitadaId, setUltimaSolicitadaId] = useState<string | null>(
    null,
  );
  const { options, isLoading, isFetching, onSearchChange } =
    useEmpleadosBusqueda();

  const periodo = parsePeriodo(searchParams.get("periodo")) ?? getPeriodoActual();
  const exportacionId = parseUuid(searchParams.get("exportacion"));

  const handleSolicitada = (id: string) => {
    setUltimaSolicitadaId(id);
    setSearchParams((current) =>
      applyParamChanges(current, { exportacion: id }),
    );
  };

  const handleCerrarResultado = () => {
    setUltimaSolicitadaId(null);
    setSearchParams((current) =>
      applyParamChanges(current, { exportacion: undefined }),
    );
  };

  return (
    <section
      aria-labelledby="exportaciones-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <PageHeader
        id="exportaciones-title"
        title="Exportaciones"
        description="Genera los archivos del mes para SUNAT y contabilidad, y envía las boletas por correo."
      />

      {exportacionId && (
        <ExportacionResultado
          exportacionId={exportacionId}
          autoEnfocar={exportacionId === ultimaSolicitadaId}
          onCerrar={handleCerrarResultado}
        />
      )}

      <NuevaExportacionForm
        periodoInicial={periodo}
        colaboradores={{
          options,
          isLoading: isLoading || isFetching,
          onSearchChange,
        }}
        onSolicitada={handleSolicitada}
      />
    </section>
  );
}
