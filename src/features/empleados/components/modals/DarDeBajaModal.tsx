import { FormProvider, useForm, useFormState } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { getTodayIsoDate, toDateInput } from "@/lib/date.utils";
import { MOTIVO_BAJA_OPTIONS } from "../../config/empleados.config";
import { useDesactivarEmpleado } from "../../hooks/useEmpleadoActions";
import {
  createDarDeBajaResolver,
  type DarDeBajaDatos,
  type DarDeBajaFormValues,
} from "../../schemas/darDeBaja.schema";
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
  const fechaInicio = toDateInput(empleado.fecha_inicio);
  const mutation = useDesactivarEmpleado();

  const methods = useForm<DarDeBajaFormValues, unknown, DarDeBajaDatos>({
    resolver: createDarDeBajaResolver({ fechaInicio, hoy: today }),
    defaultValues: { fecha_cese: today },
    // La fecha fuera de rango se avisa mientras se escribe y bloquea el envío
    mode: "onChange",
  });
  const { isValid } = useFormState({ control: methods.control });

  const onSubmit = ({ motivo, fecha_cese }: DarDeBajaDatos) =>
    mutation.mutate(
      {
        empleado,
        dto: {
          fecha_cese,
          motivo_cese: getOptionLabel(MOTIVO_BAJA_OPTIONS, motivo),
        },
      },
      { onSuccess: onClose },
    );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Dar de baja</DialogTitle>
          <DialogDescription>
            Se dará de baja a {getNombreCompleto(empleado)}. Su legajo quedará
            inactivo y cesado. Podrás reactivarlo más adelante.
          </DialogDescription>
        </DialogHeader>

        <SelectField
          name="motivo"
          label="Motivo de baja"
          options={MOTIVO_BAJA_OPTIONS}
          placeholder="Selecciona un motivo"
        />

        <TextField
          name="fecha_cese"
          label="Último día del vínculo laboral"
          type="date"
          // No puede ser anterior al ingreso ni posterior a hoy
          min={fechaInicio || undefined}
          max={today}
          description="La baja se aplica al confirmar; por eso no se permiten fechas futuras."
          disabled={mutation.isPending}
        />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Dar de baja"
          variant="destructive"
          disabled={!isValid}
        />
      </form>
    </FormProvider>
  );
}
