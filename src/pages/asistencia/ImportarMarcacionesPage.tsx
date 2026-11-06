import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { PageHeader } from "@/components/page/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import { ImportarMarcacionesArchivoPaso } from "@/features/asistencia/components/importacion/ImportarMarcacionesArchivoPaso";
import { ImportarMarcacionesRevisionPaso } from "@/features/asistencia/components/importacion/ImportarMarcacionesRevisionPaso";
import {
  MARCACIONES_IMPORTACION_STEPS,
  PASO_ARCHIVO,
  PASO_REVISION,
} from "@/features/asistencia/config/marcaciones.config";
import type {
  ImportacionMarcacionesResultado,
  ImportacionMarcacionesValidacion,
} from "@/features/asistencia/types/marcaciones.types";
import { getRangoPeriodo } from "@/features/asistencia/utils/asistencia.utils";

interface RevisionConArchivo {
  archivo: File;
  revision: ImportacionMarcacionesValidacion;
}

/**
 * Importación de marcaciones desde un Excel (.xlsx)
 *
 * @remarks
 * Guarda el archivo junto con su revisión porque importar vuelve a enviar el
 * mismo archivo. Al terminar lleva al listado filtrado por el mes importado.
 */
export default function ImportarMarcacionesPage() {
  const navigate = useNavigate();
  const [actual, setActual] = useState<RevisionConArchivo | null>(null);

  const step = actual ? PASO_REVISION : PASO_ARCHIVO;

  const handleImportado = (resultado: ImportacionMarcacionesResultado) => {
    const { inicio, fin } = getRangoPeriodo(resultado.periodo);
    const params = new URLSearchParams({ fecha_inicio: inicio, fecha_fin: fin });

    navigate(`${ROUTE_PATHS.asistencia.marcaciones}?${params.toString()}`);
  };

  return (
    <section
      aria-labelledby="importar-marcaciones-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <Link
        to={ROUTE_PATHS.asistencia.marcaciones}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a Marcaciones
      </Link>

      <PageHeader
        id="importar-marcaciones-title"
        title="Importar marcaciones"
        description="Registra las marcaciones de un mes desde un archivo de Excel."
      />

      <Stepper steps={MARCACIONES_IMPORTACION_STEPS} currentStep={step} />

      {actual ? (
        <ImportarMarcacionesRevisionPaso
          archivo={actual.archivo}
          revision={actual.revision}
          onElegirOtro={() => setActual(null)}
          onImportado={handleImportado}
        />
      ) : (
        <ImportarMarcacionesArchivoPaso
          onValidado={(archivo, revision) => setActual({ archivo, revision })}
        />
      )}
    </section>
  );
}
