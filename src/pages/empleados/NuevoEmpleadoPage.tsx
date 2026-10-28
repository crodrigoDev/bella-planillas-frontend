import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { Stepper } from "@/components/stepper/Stepper";
import { NUEVO_EMPLEADO_STEPS } from "@/features/empleados/config/nuevoEmpleado.config";

// Paso del registro que se muestra; los formularios de cada paso se agregan después
const CURRENT_STEP = 0;

/**
 * Registro de un nuevo empleado en cinco pasos
 */
export default function NuevoEmpleadoPage() {
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

      <Stepper steps={NUEVO_EMPLEADO_STEPS} currentStep={CURRENT_STEP} />

      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Formulario en construcción
      </div>
    </section>
  );
}
