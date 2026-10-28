import { ArrowLeftIcon, ArrowRightIcon, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { LoadingButton } from "@/components/form/LoadingButton";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { NUEVO_EMPLEADO_STEPS } from "../../config/nuevoEmpleado.config";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";

interface RegistroFooterProps {
  /** Paso que se muestra, empezando en 0 */
  step: number;
  /** Texto del botón para continuar */
  nextLabel?: string;
  /** Icono del botón para continuar */
  nextIcon?: LucideIcon;
  /**
   * Avanza sin enviar un formulario. Si no se indica, el botón envía el
   * formulario que lo contiene.
   */
  onNext?: () => void;
  /** Mientras se envía: se bloquean los botones y se muestra la espera */
  isSubmitting?: boolean;
  /** Oculta el botón para volver, por ejemplo cuando el empleado ya se creó */
  hideBack?: boolean;
}

/**
 * Barra inferior del registro de empleado: cancelar, volver y continuar
 *
 * @remarks
 * Cancelar descarta el borrador y vuelve al listado. Volver aparece desde el
 * segundo paso. El texto de avance sale de la lista de pasos.
 */
export function RegistroFooter({
  step,
  nextLabel = "Guardar y continuar",
  nextIcon: NextIcon = ArrowRightIcon,
  onNext,
  isSubmitting = false,
  hideBack = false,
}: RegistroFooterProps) {
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);
  const reset = useNuevoEmpleadoStore((state) => state.reset);

  return (
    <StepperFooter
      cancelAction={
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}
          onClick={reset}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      }
      progressLabel={`Paso ${step + 1} de ${NUEVO_EMPLEADO_STEPS.length} completándose`}
    >
      {step > 0 && !hideBack && (
        <Button
          type="button"
          variant="outline"
          onClick={() => goToStep(step - 1)}
          disabled={isSubmitting}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Atrás
        </Button>
      )}
      <LoadingButton
        type={onNext ? "button" : "submit"}
        onClick={onNext}
        isLoading={isSubmitting}
        icon={NextIcon}
      >
        {nextLabel}
      </LoadingButton>
    </StepperFooter>
  );
}
