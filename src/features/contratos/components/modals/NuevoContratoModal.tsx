import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
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
import { getTodayIsoDate } from "@/lib/date.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useCrearContrato } from "../../hooks/useContratoActions";
import { NuevoContratoFormSchema } from "../../schemas/contrato.schema";
import { ContratoCampos } from "../ContratoCampos";

const resolver = zodResolver(NuevoContratoFormSchema, zodResolverOptions);

type NuevoContratoValues = Parameters<typeof resolver>[0];
type NuevoContratoDatos = typeof NuevoContratoFormSchema._output;

interface NuevoContratoModalProps {
  empleadoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para registrar un contrato nuevo de un empleado que no tiene uno vigente
 *
 * @remarks
 * El formulario está dentro del contenido: al cerrarse se desmonta y
 * empieza de nuevo la próxima vez.
 */
export function NuevoContratoModal({
  empleadoId,
  open,
  onOpenChange,
}: NuevoContratoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <NuevoContratoForm
          empleadoId={empleadoId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface NuevoContratoFormProps {
  empleadoId: string;
  onClose: () => void;
}

function NuevoContratoForm({ empleadoId, onClose }: NuevoContratoFormProps) {
  const mutation = useCrearContrato(empleadoId);

  const methods = useForm<NuevoContratoValues, unknown, NuevoContratoDatos>({
    resolver,
    defaultValues: {
      tipo_modalidad: "PLAZO_FIJO",
      fecha_inicio: getTodayIsoDate(),
    },
  });

  const onSubmit = (values: NuevoContratoDatos) => {
    mutation.mutate(
      {
        ...values,
        fecha_fin: values.fecha_fin ?? null,
        observacion: values.observacion ?? null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Nuevo contrato</DialogTitle>
          <DialogDescription>
            Registra un contrato para este empleado. Quedará vigente y
            pendiente de PDF.
          </DialogDescription>
        </DialogHeader>

        <ContratoCampos />

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
            loadingText="Guardando…"
          >
            Registrar contrato
          </LoadingButton>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
