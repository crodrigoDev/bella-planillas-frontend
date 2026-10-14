import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearSolicitudSchema,
  TipoSolicitudEnum,
  type CrearSolicitudDto,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ModuleField from "@/components/modules/ModuleField";
import ModuleSelect from "@/components/modules/ModuleSelect";
import { enumItems } from "@/components/modules/module.utils";
import { EMPLEADOS_MOCK } from "@/features/empleados/data/empleados.mock";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { SolicitudFormValues } from "../types/solicitudes.types";

/** Registra una solicitud manual sin un asistente de varios pasos */
export default function SolicitudFormDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (values: CrearSolicitudDto) => void;
}) {
  const empleados = EMPLEADOS_MOCK.filter(
    (item) => item.activo && !item.deleted_at,
  );
  const form = useForm<SolicitudFormValues, unknown, CrearSolicitudDto>({
    resolver: zodResolver(CrearSolicitudSchema),
    defaultValues: {
      empleado_id: empleados[0]?.id,
      tipo: "VACACIONES",
      origen: "MANUAL_RRHH",
      motivo: "",
      observacion: "",
      fecha_inicio: null,
      fecha_fin: null,
      dias_solicitados: null,
      monto: null,
    },
  });
  const tipo = useWatch({ control: form.control, name: "tipo" });
  const { errors } = form.formState;
  const submit = (values: CrearSolicitudDto): void => {
    try {
      onSave(values);
      onClose();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo registrar la solicitud",
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
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nueva solicitud</DialogTitle>
          <DialogDescription>
            Registro manual por Recursos Humanos
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4"
        >
          <Controller
            name="empleado_id"
            control={form.control}
            render={({ field }) => (
              <ModuleSelect
                label="Empleado"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                items={empleados.map((emp) => ({
                  value: emp.id,
                  label: getEmpleadoNombre(emp),
                }))}
              />
            )}
          />
          <Controller
            name="tipo"
            control={form.control}
            render={({ field }) => (
              <ModuleSelect
                label="Tipo de solicitud"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  // No conserva valores que pertenecian al tipo anterior
                  form.setValue("monto", null);
                  form.setValue("fecha_inicio", null);
                  form.setValue("fecha_fin", null);
                  form.setValue("dias_solicitados", null);
                }}
                onBlur={field.onBlur}
                inputRef={field.ref}
                items={enumItems(TipoSolicitudEnum.options)}
              />
            )}
          />
          {tipo !== "ADELANTO_SUELDO" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ModuleField
                id="sol-inicio"
                label="Fecha de inicio"
                error={errors.fecha_inicio}
              >
                <Input
                  id="sol-inicio"
                  type="date"
                  {...form.register("fecha_inicio", {
                    setValueAs: (value) => value || null,
                  })}
                />
              </ModuleField>
              <ModuleField
                id="sol-fin"
                label="Fecha de fin"
                error={errors.fecha_fin}
              >
                <Input
                  id="sol-fin"
                  type="date"
                  {...form.register("fecha_fin", {
                    setValueAs: (value) => value || null,
                  })}
                />
              </ModuleField>
              <ModuleField
                id="sol-dias"
                label="Días solicitados"
                error={errors.dias_solicitados}
              >
                <Input
                  id="sol-dias"
                  type="number"
                  min={1}
                  {...form.register("dias_solicitados", {
                    setValueAs: (value) =>
                      value === "" ? null : Number(value),
                  })}
                />
              </ModuleField>
            </div>
          )}
          {tipo === "ADELANTO_SUELDO" && (
            <ModuleField id="sol-monto" label="Monto (S/)" error={errors.monto}>
              <Input
                id="sol-monto"
                type="number"
                step="0.0001"
                {...form.register("monto", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
              />
            </ModuleField>
          )}
          <ModuleField id="sol-motivo" label="Motivo" error={errors.motivo}>
            <Textarea id="sol-motivo" {...form.register("motivo")} />
          </ModuleField>
          <ModuleField
            id="sol-observacion"
            label="Observación (opcional)"
            error={errors.observacion}
          >
            <Textarea id="sol-observacion" {...form.register("observacion")} />
          </ModuleField>
          {errors.root && (
            <p role="alert" className="text-xs text-destructive">
              {errors.root.message}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Registrar solicitud</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
