import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { PageHeader } from "@/components/page/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import { ImportarArchivoPaso } from "@/features/empleados/components/importacion/ImportarArchivoPaso";
import { ImportarResultadoPaso } from "@/features/empleados/components/importacion/ImportarResultadoPaso";
import { ImportarRevisionPaso } from "@/features/empleados/components/importacion/ImportarRevisionPaso";
import {
  CARGA_MASIVA_STEPS,
  PASO_ARCHIVO,
  PASO_RESULTADO,
  PASO_REVISION,
} from "@/features/empleados/config/cargaMasiva.config";
import type { CargaMasivaPreValidacion } from "@/features/empleados/types/cargaMasiva.types";

/**
 * Importación masiva de empleados desde un Excel o CSV
 *
 * @remarks
 * El paso sale de lo que hay: con `?job=` en la URL se muestra el resultado
 * (así sobrevive a una recarga), con una revisión en memoria el paso 2 y,
 * si no, el paso 1.
 */
export default function ImportarEmpleadosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [revision, setRevision] = useState<CargaMasivaPreValidacion | null>(
    null,
  );

  const jobId = searchParams.get("job");
  const step = jobId ? PASO_RESULTADO : revision ? PASO_REVISION : PASO_ARCHIVO;

  const handleConfirmado = (nuevoJobId: string) => {
    setRevision(null);
    setSearchParams({ job: nuevoJobId });
  };

  const handleReiniciar = () => {
    setRevision(null);
    setSearchParams({});
  };

  return (
    <section
      aria-labelledby="importar-empleados-title"
      className="mx-auto w-full max-w-7xl space-y-6"
    >
      <Link
        to={ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a Empleados
      </Link>

      <PageHeader
        id="importar-empleados-title"
        title="Importar empleados"
        description="Registra varios colaboradores a la vez desde un archivo de Excel o CSV."
      />

      <Stepper steps={CARGA_MASIVA_STEPS} currentStep={step} />

      {step === PASO_RESULTADO && jobId ? (
        <ImportarResultadoPaso jobId={jobId} onReiniciar={handleReiniciar} />
      ) : step === PASO_REVISION && revision ? (
        <ImportarRevisionPaso
          revision={revision}
          onElegirOtro={handleReiniciar}
          onConfirmado={handleConfirmado}
        />
      ) : (
        <ImportarArchivoPaso onValidado={setRevision} />
      )}
    </section>
  );
}
