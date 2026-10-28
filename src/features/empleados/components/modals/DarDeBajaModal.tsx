import { useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { getTodayIsoDate } from "@/lib/date.utils";
import { MOTIVO_BAJA_OPTIONS } from "../../config/empleados.config";
import { useDesactivarEmpleado } from "../../hooks/useEmpleadoActions";
import type { Empleado } from "../../types/empleados.types";
import { getNombreCompleto } from "../../utils/empleados.utils";

interface DarDeBajaModalProps {
  empleado: Empleado;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para dar de baja a un empleado indicando fecha y motivo de cese
 *
 * @remarks
 * El formulario está dentro del contenido del modal: al cerrarse se
 * desmonta y la próxima vez que se abra empieza vacío.
 */
export function DarDeBajaModal({
  empleado,
  open,
  onOpenChange,
}: DarDeBajaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DarDeBajaForm
          empleado={empleado}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface DarDeBajaFormProps {
  empleado: Empleado;
  onClose: () => void;
}

function DarDeBajaForm({ empleado, onClose }: DarDeBajaFormProps) {
  const today = getTodayIsoDate();

  const [fechaCese, setFechaCese] = useState(today);
  const [motivo, setMotivo] = useState<string | null>(null);
  const mutation = useDesactivarEmpleado();

  const motivoLabel = MOTIVO_BAJA_OPTIONS.find(
    (option) => option.value === motivo,
  )?.label;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fechaCese || !motivoLabel) return;

    mutation.mutate(
      {
        empleado,
        dto: { fecha_cese: fechaCese, motivo_cese: motivoLabel },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Dar de baja</DialogTitle>
        <DialogDescription>
          Se dará de baja a {getNombreCompleto(empleado)}. Su legajo quedará
          inactivo y cesado. Podrás reactivarlo más adelante.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="baja-motivo">Motivo de baja</FieldLabel>
        <Select
          items={MOTIVO_BAJA_OPTIONS}
          value={motivo}
          onValueChange={setMotivo}
          disabled={mutation.isPending}
        >
          <SelectTrigger id="baja-motivo" className="w-full">
            <SelectValue placeholder="Selecciona un motivo" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {MOTIVO_BAJA_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="baja-fecha">Último día del vínculo laboral</FieldLabel>
        <Input
          id="baja-fecha"
          type="date"
          value={fechaCese}
          onChange={(event) => setFechaCese(event.target.value)}
          // No puede ser anterior al ingreso ni posterior a hoy
          min={empleado.fecha_inicio?.slice(0, 10)}
          max={today}
          required
          disabled={mutation.isPending}
        />
        <FieldDescription>
          La baja se aplica al confirmar; por eso no se permiten fechas futuras.
        </FieldDescription>
      </Field>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>{getApiErrorMessage(mutation.error)}</AlertDescription>
        </Alert>
      )}

      <DialogFooter>
        <DialogClose
          render={<Button type="button" variant="outline" />}
          disabled={mutation.isPending}
        >
          Cancelar
        </DialogClose>
        <Button
          type="submit"
          variant="destructive"
          disabled={!fechaCese || !motivo || mutation.isPending}
        >
          {mutation.isPending && <Spinner data-icon="inline-start" />}
          Dar de baja
        </Button>
      </DialogFooter>
    </form>
  );
}
