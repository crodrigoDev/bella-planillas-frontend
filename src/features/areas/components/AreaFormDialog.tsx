import { useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus } from "lucide-react";
import {
  ActualizarAreaSchema,
  CrearAreaSchema,
} from "@jyp/shared-contracts";
import type { CrearAreaDto } from "@jyp/shared-contracts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AreaViewModel } from "@/features/areas/types/areas.types";

/** Estado y acciones del formulario de áreas. */
interface AreaFormDialogProps {
  /** Indica si el modal está abierto. */
  isOpen: boolean;
  /** Área que se editará; sin ella se registra una nueva. */
  area?: AreaViewModel;
  /** Actualiza la apertura del modal. */
  onOpenChange: (isOpen: boolean) => void;
  /** Recibe los datos validados del formulario. */
  onSave: (values: CrearAreaDto) => void;
}

/**
 * Registra o edita un área usando los contratos compartidos.
 * El padre monta una nueva instancia al abrir el formulario.
 */
export function AreaFormDialog({
  isOpen,
  area,
  onOpenChange,
  onSave,
}: AreaFormDialogProps) {
  const isEditing = Boolean(area);

  const [name, setName] = useState(area?.nombre ?? "");
  const [description, setDescription] = useState(
    area?.descripcion ?? "",
  );

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    general?: string;
  }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = {
      nombre: name.trim(),
      descripcion: description.trim(),
    };

    const result = isEditing
      ? ActualizarAreaSchema.safeParse(values)
      : CrearAreaSchema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten();

      setErrors({
        name: flattened.fieldErrors.nombre?.[0],
        description: flattened.fieldErrors.descripcion?.[0],
        general: flattened.formErrors[0],
      });

      return;
    }

    onSave({
      nombre: result.data.nombre ?? values.nombre,
      descripcion: result.data.descripcion,
    });

    onOpenChange(false);
  }

  const Icon = isEditing ? Pencil : Plus;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              <Icon aria-hidden="true" className="size-5" />
            </span>

            {isEditing ? "Editar área" : "Registrar área"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Actualiza los datos del área."
              : "Completa los datos de la nueva área."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="area-name">
              Nombre de área
              <span className="text-destructive">*</span>
            </Label>

            <Input
              id="area-name"
              placeholder="Ej: Operaciones & Logística"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "area-name-error" : undefined
              }
            />

            {errors.name && (
              <p
                id="area-name-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area-description">
              Descripción breve (opcional)
            </Label>

            <Textarea
              id="area-description"
              placeholder="Describe el alcance o funciones principales del área…"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="min-h-28 resize-none"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "area-description-error"
                  : undefined
              }
            />

            {errors.description && (
              <p
                id="area-description-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.description}
              </p>
            )}
          </div>

          {errors.general && (
            <p role="alert" className="text-sm text-destructive">
              {errors.general}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isEditing ? "Guardar cambios" : "Registrar área"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}