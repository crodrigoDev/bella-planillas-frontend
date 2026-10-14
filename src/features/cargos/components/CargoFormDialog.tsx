import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CrearCargoSchema, type CrearCargoDto } from "@jyp/shared-contracts";
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
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import type { CargoListado } from "../types/cargos.types";

/** Registra o edita un cargo en un solo formulario */
export default function CargoFormDialog({
  cargo,
  onClose,
  onSave,
}: {
  cargo?: CargoListado;
  onClose: () => void;
  onSave: (values: CrearCargoDto) => void;
}) {
  const form = useForm<CrearCargoDto>({
    resolver: zodResolver(CrearCargoSchema),
    defaultValues: cargo ?? {
      id_area: AREAS_MOCK[0].id,
      nombre: "",
      descripcion: "",
      sueldo_minimo: 1130,
      sueldo_maximo: null,
    },
  });
  const { errors } = form.formState;
  const submit = (values: CrearCargoDto): void => {
    try {
      onSave(values);
      onClose();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el cargo",
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
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{cargo ? "Editar cargo" : "Nuevo cargo"}</DialogTitle>
          <DialogDescription>
            Área, funciones y banda salarial del puesto
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          onSubmit={form.handleSubmit(submit)}
          className="space-y-4"
        >
          <Controller
            name="id_area"
            control={form.control}
            render={({ field, fieldState }) => (
              <ModuleSelect
                label="Área"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                invalid={Boolean(fieldState.error)}
                items={AREAS_MOCK.map((area) => ({
                  value: area.id,
                  label: area.nombre,
                }))}
              />
            )}
          />
          <ModuleField
            id="cargo-nombre"
            label="Nombre del cargo"
            error={errors.nombre}
          >
            <Input id="cargo-nombre" {...form.register("nombre")} />
          </ModuleField>
          <ModuleField
            id="cargo-descripcion"
            label="Descripción"
            error={errors.descripcion}
          >
            <Textarea
              id="cargo-descripcion"
              {...form.register("descripcion")}
            />
          </ModuleField>
          <div className="grid gap-4 sm:grid-cols-2">
            <ModuleField
              id="cargo-minimo"
              label="Sueldo mínimo (S/)"
              error={errors.sueldo_minimo}
            >
              <Input
                id="cargo-minimo"
                type="number"
                step="0.01"
                {...form.register("sueldo_minimo", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
              />
            </ModuleField>
            <ModuleField
              id="cargo-maximo"
              label="Sueldo máximo (S/)"
              error={errors.sueldo_maximo}
            >
              <Input
                id="cargo-maximo"
                type="number"
                step="0.01"
                {...form.register("sueldo_maximo", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
              />
            </ModuleField>
          </div>
          {errors.root && (
            <p role="alert" className="text-xs text-destructive">
              {errors.root.message}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cargo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
