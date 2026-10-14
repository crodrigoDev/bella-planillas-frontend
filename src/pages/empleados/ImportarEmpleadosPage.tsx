import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, CircleAlert } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { IMPORTACION_PASOS } from "@/features/empleados/config/importar-empleados.config";
import { useImportarEmpleados } from "@/features/empleados/hooks/useImportarEmpleados";
import ImportacionArchivo from "@/features/empleados/components/importar/ImportacionArchivo";
import ImportacionRevision from "@/features/empleados/components/importar/ImportacionRevision";
import ImportacionResultado from "@/features/empleados/components/importar/ImportacionResultado";

/** Compone la importacion de prueba con los pasos del flujo de carga masiva */
export default function ImportarEmpleadosPage() {
  const flow = useImportarEmpleados();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [flow.stage]);

  return (
    <section
      className="-m-4 min-h-full bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8"
      aria-labelledby="importar-empleados-title"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          to={ROUTE_PATHS.gestionPersonal.empleados}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Volver a
          empleados
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1
              id="importar-empleados-title"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Importar empleados
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Carga empleados y datos financieros mediante un archivo Excel o
              CSV
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Esta vista usa datos de ejemplo. Los cambios se reinician al recargar
          la aplicación.
        </p>
        <ol aria-label="Pasos de importación" className="grid grid-cols-3 py-2">
          {IMPORTACION_PASOS.map((step, index) => (
            <li
              key={step.title}
              aria-current={index === flow.stage ? "step" : undefined}
              className="relative flex flex-col items-center gap-2 px-1 text-center"
            >
              {index < 2 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-4 left-1/2 h-px w-full",
                    index < flow.stage ? "bg-primary" : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold",
                  index <= flow.stage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {index < flow.stage ? (
                  <Check aria-hidden="true" className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <p
                  className={cn(
                    "text-[11px] font-medium sm:text-xs",
                    index === flow.stage
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Paso {flow.stage + 1}: {IMPORTACION_PASOS[flow.stage].title}
        </h2>
        {flow.error && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{flow.error}</AlertDescription>
          </Alert>
        )}
        {flow.stage === 0 && (
          <ImportacionArchivo
            file={flow.file}
            scenario={flow.scenario}
            onFile={flow.chooseFile}
            onScenario={flow.setScenario}
            onExample={flow.loadExample}
            onValidate={flow.validate}
          />
        )}
        {flow.stage === 1 && flow.report && (
          <ImportacionRevision
            report={flow.report}
            fileName={flow.file?.name}
            onBack={flow.back}
            onConfirm={flow.confirm}
          />
        )}
        {flow.stage === 2 && flow.job && (
          <ImportacionResultado
            job={flow.job}
            isProcessing={flow.isProcessing}
            onReset={flow.reset}
          />
        )}
      </div>
    </section>
  );
}
