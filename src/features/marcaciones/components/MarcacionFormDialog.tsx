import { Controller, useForm } from "react-hook-form";
import {
  TipoMarcacion,
  marcarAsistenciaSchema,
  type MarcarAsistenciaDto,
} from "@jyp/shared-contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModuleSelect from "@/components/modules/ModuleSelect";
import ModuleField from "@/components/modules/ModuleField";
import { enumItems } from "@/components/modules/module.utils";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";

type MarcacionFormValues = Omit<MarcarAsistenciaDto, "fecha_hora"> & {
  fecha_local: string;
};

/** Convierte la fecha ingresada en Lima al valor que solicita el contrato */
export default function MarcacionFormDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: MarcarAsistenciaDto) => void;
}) {
  const empleados = EMPLEADOS_MOCK.filter(
    (emp) => emp.activo && !emp.deleted_at,
  );
  const form = useForm<MarcacionFormValues>({
    defaultValues: {
      nro_documento: empleados[0]?.nro_documento ?? "",
      tipo_marcacion: TipoMarcacion.ENTRADA,
      fecha_local: "2026-10-14T08:00",
    },
  });
  const submit = (values: MarcacionFormValues): void => {
    const result = marcarAsistenciaSchema.safeParse({
      ...values,
      fecha_hora: new Date(`${values.fecha_local}:00-05:00`),
    });
    if (!result.success) {
      form.setError("root", { message: result.error.issues[0]?.message });
      return;
    }
    try {
      onSave(result.data);
      onClose();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo registrar la marcación",
      });
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar marcación</DialogTitle>
          <DialogDescription>
            Registro manual con hora de Lima
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4"
        >
          <Controller
            name="nro_documento"
            control={form.control}
            render={({ field }) => (
              <ModuleSelect
                label="Empleado"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                items={empleados.map((emp) => ({
                  value: emp.nro_documento,
                  label: `${getEmpleadoNombre(emp)} · ${emp.nro_documento}`,
                }))}
              />
            )}
          />
          <Controller
            name="tipo_marcacion"
            control={form.control}
            render={({ field }) => (
              <ModuleSelect
                label="Tipo de marcación"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                items={enumItems(Object.values(TipoMarcacion))}
              />
            )}
          />
          <ModuleField
            id="marca-fecha"
            label="Fecha y hora"
            error={form.formState.errors.fecha_local}
          >
            <Input
              id="marca-fecha"
              type="datetime-local"
              {...form.register("fecha_local", {
                required: "Ingresa una fecha y hora",
              })}
            />
          </ModuleField>
          {form.formState.errors.root && (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
