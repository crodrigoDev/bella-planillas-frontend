import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { Stepper } from "@/components/stepper/Stepper";
import { Button } from "@/components/ui/button";
import { DatosEmpleadoForm } from "@/features/empleados/components/DatosEmpleadoForm";
import { NUEVO_EMPLEADO_STEPS } from "@/features/empleados/config/nuevoEmpleado.config";
import { useNuevoEmpleadoStore } from "@/features/empleados/store/nuevoEmpleado.store";

/**
 * Registro de un nuevo empleado en cinco pasos
 */
export default function NuevoEmpleadoPage() {
  const step = useNuevoEmpleadoStore((state) => state.step);
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  // Al salir del registro se descarta el borrador: son datos personales
  useEffect(() => reset, [reset]);

  return (
    <section aria-labelledby="nuevo-empleado-title" className="space-y-6">
      <Link
        to={ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a Empleados
      </Link>

      <header>
        <h1 id="nuevo-empleado-title" className="text-2xl font-semibold">
          Nuevo empleado
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra la información del colaborador en el sistema para dar de
          alta su legajo.
        </p>
      </header>

      <Stepper steps={NUEVO_EMPLEADO_STEPS} currentStep={step} />

      {step === 0 ? (
        <DatosEmpleadoForm />
      ) : (
        // Los formularios de los pasos 2 a 5 se agregan después
        <div className="space-y-4 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          <p>Formulario en construcción</p>
          <Button variant="outline" onClick={() => goToStep(step - 1)}>
            Volver al paso anterior
          </Button>
        </div>
      )}
    </section>
  );
}
