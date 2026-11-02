import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditarEmpleadoSchema,
  type EditarEmpleadoDto,
} from "@jyp/shared-contracts";
import { SaveIcon } from "lucide-react";

import { buildEmpleadoPath } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useEditarEmpleado } from "../../hooks/useEditarEmpleado";
import type { Empleado } from "../../types/empleados.types";
import { DatosEmpleadoCampos } from "../registro/DatosEmpleadoCampos";

const resolver = zodResolver(EditarEmpleadoSchema, zodResolverOptions);

type EditarEmpleadoFormValues = Parameters<typeof resolver>[0];

// Las fechas pueden llegar con hora; el campo de fecha solo acepta AAAA-MM-DD
const toDateInput = (value: string | null | undefined): string =>
  value?.slice(0, 10) ?? "";

/** Convierte al empleado de la ficha en los valores iniciales del formulario */
const toFormValues = (empleado: Empleado): EditarEmpleadoFormValues => ({
  documento_id: empleado.documento_id,
  nro_documento: empleado.nro_documento,
  nombre: empleado.nombre ?? "",
  apellido: empleado.apellido ?? "",
  sexo: empleado.sexo as EditarEmpleadoFormValues["sexo"],
  estado_civil:
    empleado.estado_civil as EditarEmpleadoFormValues["estado_civil"],
  nacionalidad: empleado.nacionalidad ?? "",
  fecha_nacimiento: toDateInput(empleado.fecha_nacimiento),
  email: empleado.email ?? "",
  telefono: empleado.telefono ?? "",
  direccion: empleado.direccion ?? "",
  referencia_direccion: empleado.referencia_direccion ?? "",
  departamento: empleado.departamento ?? "",
  provincia: empleado.provincia ?? "",
  distrito: empleado.distrito ?? "",
  ubigeo: empleado.ubigeo ?? "",
  area_id: empleado.area.id,
  cargo_id: empleado.cargo.id,
  jornada_id: empleado.jornada?.id,
  fecha_inicio: toDateInput(empleado.fecha_inicio),
  asig_familiar: empleado.asig_familiar ?? false,
});

interface EditarEmpleadoFormProps {
  empleado: Empleado;
}

/**
 * Formulario para editar los datos personales y laborales de un empleado
 *
 * @remarks
 * Reutiliza los campos del registro. Solo toca los datos del empleado, no
 * sus contratos, derechohabientes ni datos financieros. Al guardar vuelve a la ficha.
 */
export function EditarEmpleadoForm({ empleado }: EditarEmpleadoFormProps) {
  const navigate = useNavigate();
  const editar = useEditarEmpleado(empleado.id);
  const fichaPath = buildEmpleadoPath(empleado.id);

  const methods = useForm<
    EditarEmpleadoFormValues,
    unknown,
    EditarEmpleadoDto
  >({
    resolver,
    defaultValues: toFormValues(empleado),
  });

  const onSubmit = (values: EditarEmpleadoDto) =>
    editar.mutate(
      // Sin jornada se envía null: si no se enviara, el backend dejaría la anterior
      { ...values, jornada_id: values.jornada_id ?? null },
      { onSuccess: () => navigate(fichaPath) },
    );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <DatosEmpleadoCampos isEdicion />

        <ErrorAlert
          error={editar.error}
          title="No se pudieron guardar los cambios"
        />

        <StepperFooter
          progressLabel="Editando legajo"
          cancelAction={
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to={fichaPath} />}
              disabled={editar.isPending}
            >
              Cancelar
            </Button>
          }
        >
          <LoadingButton
            type="submit"
            isLoading={editar.isPending}
            loadingText="Guardando…"
            icon={SaveIcon}
          >
            Guardar cambios
          </LoadingButton>
        </StepperFooter>
      </form>
    </FormProvider>
  );
}
