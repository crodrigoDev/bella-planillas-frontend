import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditarEmpleadoSchema, type EditarEmpleadoDto } from "@jyp/shared-contracts";
import { Save } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { EditarEmpleadoFormValues } from "../../types/empleado-form.types";
import type { EmpleadoMock } from "../../types/empleados.types";
import { getEditarEmpleadoDefaults } from "../../utils/editar-empleado.utils";
import EmpleadoDatosPersonales from "../form/EmpleadoDatosPersonales";
import EmpleadoDatosLaborales from "../form/EmpleadoDatosLaborales";

interface EditarEmpleadoFormProps {
  empleado: EmpleadoMock;
  onSubmit: (values: EditarEmpleadoDto) => void | Promise<void>;
}

/** Valida la edicion y entrega unicamente los campos modificados */
export default function EditarEmpleadoForm({ empleado, onSubmit }: EditarEmpleadoFormProps) {
  const form = useForm<EditarEmpleadoFormValues, unknown, EditarEmpleadoDto>({
    resolver: zodResolver(EditarEmpleadoSchema),
    defaultValues: getEditarEmpleadoDefaults(empleado),
    mode: "onTouched",
  });
  const { isDirty, isSubmitting, errors, dirtyFields } = form.formState;

  const submit = async (values: EditarEmpleadoDto): Promise<void> => {
    if (!isDirty) return;
    try {
      // Los datos que no se tocaron conservan su valor anterior
      const cambios = Object.fromEntries(
        Object.entries(values).filter(([key]) => Reflect.get(dirtyFields, key)),
      );
      await onSubmit(EditarEmpleadoSchema.parse(cambios));
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "No se pudieron guardar los cambios" });
    }
  };

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <EmpleadoDatosPersonales editing />
        <EmpleadoDatosLaborales editing />
        <FieldError errors={[errors.root]} />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background p-4">
          <p className="text-xs text-muted-foreground">Solo se guardarán los campos que modificaste</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={isSubmitting} render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}>Cancelar</Button>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? <Spinner aria-hidden="true" /> : <Save aria-hidden="true" />}
              {isSubmitting ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
