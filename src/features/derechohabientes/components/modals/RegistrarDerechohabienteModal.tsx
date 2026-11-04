import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import type { SelectOption } from "@/lib/types/options.types";
import { useRegistrarDerechohabiente } from "../../hooks/useDerechohabienteActions";
import { DatosDerechohabienteSchema } from "../../schemas/datosDerechohabiente.schema";
import { DerechohabienteCampos } from "../DerechohabienteCampos";

const resolver = zodResolver(DatosDerechohabienteSchema, zodResolverOptions);

type RegistrarValues = Parameters<typeof resolver>[0];
type RegistrarDatos = typeof DatosDerechohabienteSchema._output;

// Valores con los que empieza cada derechohabiente que se registra
const EMPTY_VALUES = {
  nro_documento: "",
  nombres: "",
  apellidos: "",
  estado_civil: "SOLTERO",
  fecha_nacimiento: "",
} as const;

interface RegistrarDerechohabienteModalProps {
  empleadoId: string;
  tiposDocumento: SelectOption[] | undefined;
  isLoadingTiposDocumento: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para registrar un familiar del empleado como derechohabiente
 *
 * @remarks
 * Valida con el mismo esquema del registro, que incluye la edad según el
 * vínculo. El formulario está dentro del contenido: al cerrarse se desmonta
 * y empieza vacío la próxima vez.
 */
export function RegistrarDerechohabienteModal({
  empleadoId,
  tiposDocumento,
  isLoadingTiposDocumento,
  open,
  onOpenChange,
}: RegistrarDerechohabienteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-2xl">
        <RegistrarDerechohabienteForm
          empleadoId={empleadoId}
          tiposDocumento={tiposDocumento}
          isLoadingTiposDocumento={isLoadingTiposDocumento}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RegistrarDerechohabienteFormProps {
  empleadoId: string;
  tiposDocumento: SelectOption[] | undefined;
  isLoadingTiposDocumento: boolean;
  onClose: () => void;
}

function RegistrarDerechohabienteForm({
  empleadoId,
  tiposDocumento,
  isLoadingTiposDocumento,
  onClose,
}: RegistrarDerechohabienteFormProps) {
  const mutation = useRegistrarDerechohabiente(empleadoId);

  const methods = useForm<RegistrarValues, unknown, RegistrarDatos>({
    resolver,
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = (values: RegistrarDatos) =>
    mutation.mutate(values, { onSuccess: onClose });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Agregar derechohabiente</DialogTitle>
          <DialogDescription>
            Cónyuge, hijos u otro familiar con derecho a beneficios. Un hijo
            menor o estudiante activa la asignación familiar del empleado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <DerechohabienteCampos
            tiposDocumento={tiposDocumento}
            isLoadingTiposDocumento={isLoadingTiposDocumento}
          />
        </div>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Agregar"
        />
      </form>
    </FormProvider>
  );
}
