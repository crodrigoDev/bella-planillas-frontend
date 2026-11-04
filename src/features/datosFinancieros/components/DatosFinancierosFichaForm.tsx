import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { SaveIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { useDatosFinancierosFichaForm } from "../hooks/useDatosFinancierosFichaForm";
import type { DatosFinancieros } from "../types/datosFinancieros.types";
import { ConfirmarPasswordModal } from "./ConfirmarPasswordModal";
import { DatosFinancierosCampos } from "./DatosFinancierosCampos";

interface DatosFinancierosFichaFormProps {
  empleadoId: string;
  /** Datos guardados; null si el empleado todavía no tiene y se registran por primera vez */
  datos: DatosFinancieros | null;
  /** A dónde se vuelve al guardar o cancelar */
  fichaPath: string;
  /** Fecha de filiación a la AFP que ya tiene el empleado; null si no tiene */
  afpFechaFiliacion: string | null;
  /** Guarda la fecha de filiación en el empleado; la compone la página, que conoce a `empleados` */
  guardarFiliacion: (fecha: string) => Promise<void>;
}

/**
 * Formulario para registrar o editar los datos financieros de un empleado desde su ficha
 *
 * @remarks
 * Las reglas y el envío viven en `useDatosFinancierosFichaForm`. Registrar no pide
 * contraseña; editar sí, en un modal al guardar.
 */
export function DatosFinancierosFichaForm({
  empleadoId,
  datos,
  fichaPath,
  afpFechaFiliacion,
  guardarFiliacion,
}: DatosFinancierosFichaFormProps) {
  const {
    methods,
    handleSubmit,
    crear,
    editar,
    isSaving,
    confirmando,
    handleConfirm,
    handleModalChange,
  } = useDatosFinancierosFichaForm({
    empleadoId,
    datos,
    fichaPath,
    afpFechaFiliacion,
    guardarFiliacion,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <DatosFinancierosCampos guardados={datos} incluirFiliacion />

        {/* Al registrar, el error se muestra aquí; al editar, dentro del modal de contraseña */}
        <ErrorAlert
          error={datos ? null : crear.error}
          title="No se pudieron guardar los datos financieros"
        />

        <StepperFooter
          progressLabel={datos ? "Editando datos financieros" : "Registrando datos financieros"}
          cancelAction={
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to={fichaPath} />}
              disabled={isSaving}
            >
              Cancelar
            </Button>
          }
        >
          <LoadingButton
            type="submit"
            isLoading={!datos && crear.isPending}
            loadingText="Guardando…"
            icon={SaveIcon}
          >
            {datos ? "Guardar cambios" : "Registrar datos"}
          </LoadingButton>
        </StepperFooter>
      </form>

      <ConfirmarPasswordModal
        open={confirmando}
        onOpenChange={handleModalChange}
        onConfirm={handleConfirm}
        isPending={editar.isPending}
        error={editar.error}
      />
    </FormProvider>
  );
}
