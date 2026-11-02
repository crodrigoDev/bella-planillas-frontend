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
import { getTodayIsoDate, toDateInput } from "@/lib/date.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useRenovarContrato } from "../../hooks/useContratoActions";
import { RenovarContratoFormSchema } from "../../schemas/contrato.schema";
import type { Contrato } from "../../types/contratos.types";
import { getDiaSiguiente } from "../../utils/contratos.utils";
import { ContratoCampos } from "../ContratoCampos";

const resolver = zodResolver(RenovarContratoFormSchema, zodResolverOptions);

type RenovarContratoValues = Parameters<typeof resolver>[0];
type RenovarContratoDatos = typeof RenovarContratoFormSchema._output;

interface RenovarContratoModalProps {
  contrato: Contrato;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para renovar un contrato: se piden los datos del contrato nuevo
 *
 * @remarks
 * El contrato actual pasa a Renovado y el nuevo nace Vigente y sin PDF.
 * El formulario está dentro del contenido: al cerrarse se desmonta y
 * empieza de nuevo la próxima vez.
 */
export function RenovarContratoModal({
  contrato,
  open,
  onOpenChange,
}: RenovarContratoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <RenovarContratoForm
          contrato={contrato}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RenovarContratoFormProps {
  contrato: Contrato;
  onClose: () => void;
}

function RenovarContratoForm({ contrato, onClose }: RenovarContratoFormProps) {
  const mutation = useRenovarContrato(contrato.id);

  const methods = useForm<
    RenovarContratoValues,
    unknown,
    RenovarContratoDatos
  >({
    resolver,
    // El contrato nuevo empieza el día siguiente al fin del actual
    defaultValues: {
      tipo_modalidad: contrato.tipo_modalidad,
      fecha_inicio: contrato.fecha_fin
        ? getDiaSiguiente(toDateInput(contrato.fecha_fin))
        : getTodayIsoDate(),
    },
  });

  const onSubmit = (values: RenovarContratoDatos) => {
    mutation.mutate(
      { ...values, fecha_fin: values.fecha_fin ?? null },
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
          <DialogTitle>Renovar contrato</DialogTitle>
          <DialogDescription>
            Se creará un contrato nuevo y el actual pasará a Renovado. El
            nuevo contrato queda pendiente de PDF.
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
            loadingText="Renovando…"
          >
            Renovar
          </LoadingButton>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
