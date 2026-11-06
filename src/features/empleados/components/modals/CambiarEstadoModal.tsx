import { FormProvider, useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CambiarEstadoLaboralSchema } from "@jyp/shared-contracts";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { SelectField } from "@/components/form/SelectField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { ESTADO_LABORAL_OPTIONS } from "../../config/empleados.config";
import { useCambiarEstadoLaboral } from "../../hooks/useEmpleadoActions";
import type { Empleado } from "../../types/empleados.types";
import { getNombreCompleto } from "../../utils/empleados.utils";

const resolver = zodResolver(CambiarEstadoLaboralSchema, zodResolverOptions);

type CambiarEstadoValues = Parameters<typeof resolver>[0];
type CambiarEstadoDatos = typeof CambiarEstadoLaboralSchema._output;

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
  const mutation = useCambiarEstadoLaboral();

  // El backend rechaza "cambiar" al estado que el empleado ya tiene
  const options = ESTADO_LABORAL_OPTIONS.filter(
    (option) => option.value !== empleado.estado_laboral,
  );

  const methods = useForm<CambiarEstadoValues, unknown, CambiarEstadoDatos>({
    resolver,
    mode: "onChange",
  });
  const { isValid } = useFormState({ control: methods.control });

  const onSubmit = (dto: CambiarEstadoDatos) =>
    mutation.mutate({ empleado, dto }, { onSuccess: onClose });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Cambiar estado laboral</DialogTitle>
          <DialogDescription>
            {getNombreCompleto(empleado)} sigue activo en la empresa. Elige su
            nueva situación.
          </DialogDescription>
        </DialogHeader>

        <SelectField
          name="estado_laboral"
          label="Nuevo estado"
          options={options}
          placeholder="Selecciona un estado"
        />

        <FormField name="motivo" label="Motivo (opcional)">
          {(invalid) => (
            <Textarea
              id="motivo"
              maxLength={255}
              aria-invalid={invalid}
              disabled={mutation.isPending}
              // Un motivo vacío o solo con espacios no se envía
              {...methods.register("motivo", {
                setValueAs: (value: string) => value.trim() || undefined,
              })}
            />
          )}
        </FormField>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Guardar cambio"
          disabled={!isValid}
        />
      </form>
    </FormProvider>
  );
}
