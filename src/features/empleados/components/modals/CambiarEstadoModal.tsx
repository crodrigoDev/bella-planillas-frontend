import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ESTADO_LABORAL_OPTIONS } from "../../config/empleados.config";
import { useCambiarEstadoLaboral } from "../../hooks/useEmpleadoActions";
import type {
  Empleado,
  EstadoLaboralEditable,
} from "../../types/empleados.types";
import { getNombreCompleto } from "../../utils/empleados.utils";

interface CambiarEstadoModalProps {
  empleado: Empleado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para cambiar el estado laboral de un empleado activo
 *
 * @remarks
 * El formulario está dentro del contenido del modal: al cerrarse se
 * desmonta y la próxima vez que se abra empieza vacío.
 */
export function CambiarEstadoModal({
  empleado,
  open,
  onOpenChange,
}: CambiarEstadoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <CambiarEstadoForm
          empleado={empleado}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface CambiarEstadoFormProps {
  empleado: Empleado;
  onClose: () => void;
}

function CambiarEstadoForm({ empleado, onClose }: CambiarEstadoFormProps) {
  const [estado, setEstado] = useState<EstadoLaboralEditable | null>(null);
  const [motivo, setMotivo] = useState("");
  const mutation = useCambiarEstadoLaboral();

  // El backend rechaza "cambiar" al estado que el empleado ya tiene
  const options = ESTADO_LABORAL_OPTIONS.filter(
    (option) => option.value !== empleado.estado_laboral,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!estado) return;

    mutation.mutate(
      {
        empleado,
        dto: { estado_laboral: estado, motivo: motivo.trim() || undefined },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Cambiar estado laboral</DialogTitle>
        <DialogDescription>
          {getNombreCompleto(empleado)} sigue activo en la empresa. Elige su
          nueva situación.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="estado-laboral">Nuevo estado</FieldLabel>
        <Select
          items={options}
          value={estado}
          onValueChange={setEstado}
          disabled={mutation.isPending}
        >
          <SelectTrigger id="estado-laboral" className="w-full">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="estado-motivo">Motivo (opcional)</FieldLabel>
        <Textarea
          id="estado-motivo"
          value={motivo}
          onChange={(event) => setMotivo(event.target.value)}
          maxLength={255}
          disabled={mutation.isPending}
        />
      </Field>

      <ErrorAlert error={mutation.error} />

      <DialogFooter>
        <DialogClose
          render={<Button type="button" variant="outline" />}
          disabled={mutation.isPending}
        >
          Cancelar
        </DialogClose>
        <LoadingButton
          type="submit"
          isLoading={mutation.isPending}
          disabled={!estado}
        >
          Guardar cambio
        </LoadingButton>
      </DialogFooter>
    </form>
  );
}
