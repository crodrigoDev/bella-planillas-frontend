import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { PageHeader } from "@/components/page/PageHeader";
import { Stepper } from "@/components/stepper/Stepper";
import { SalirRegistroModal } from "@/features/empleados/components/modals/SalirRegistroModal";
import { DatosContratoForm } from "@/features/empleados/components/registro/DatosContratoForm";
import { DatosDerechohabientesForm } from "@/features/empleados/components/registro/DatosDerechohabientesForm";
import { DatosEmpleadoForm } from "@/features/empleados/components/registro/DatosEmpleadoForm";
import { DatosFinancierosForm } from "@/features/empleados/components/registro/DatosFinancierosForm";
import { ResumenRegistro } from "@/features/empleados/components/registro/ResumenRegistro";
import { NUEVO_EMPLEADO_STEPS } from "@/features/empleados/config/nuevoEmpleado.config";
import { useAvisoSalidaRegistro } from "@/features/empleados/hooks/useAvisoSalidaRegistro";
import { useNuevoEmpleadoStore } from "@/features/empleados/store/nuevoEmpleado.store";

/**
 * Registro de un nuevo empleado en cinco pasos
 */
export default function NuevoEmpleadoPage() {
  const step = useNuevoEmpleadoStore((state) => state.step);
  const reset = useNuevoEmpleadoStore((state) => state.reset);
  const { isBlocked, stay, leave } = useAvisoSalidaRegistro();

  // Al salir del registro se descarta el borrador: son datos personales
  useEffect(() => reset, [reset]);

  return (
    <section aria-labelledby="nuevo-empleado-title" className="mx-auto w-full max-w-7xl space-y-6">
      <Link
        to={ROUTE_PATHS.gestionPersonal.empleados}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a Empleados
      </Link>

      <PageHeader
        id="nuevo-empleado-title"
        title="Nuevo empleado"
        description="Registra la información del colaborador en el sistema para dar de alta su legajo."
      />

      <Stepper steps={NUEVO_EMPLEADO_STEPS} currentStep={step} />

      {step === 0 ? (
        <DatosEmpleadoForm />
      ) : step === 1 ? (
        <DatosFinancierosForm />
      ) : step === 2 ? (
        <DatosContratoForm />
      ) : step === 3 ? (
        <DatosDerechohabientesForm />
      ) : (
        <ResumenRegistro />
      )}

      <SalirRegistroModal
        open={isBlocked}
        onStay={stay}
        onLeave={leave}
      />
    </section>
  );
}
