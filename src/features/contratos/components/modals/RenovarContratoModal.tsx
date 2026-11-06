import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTodayIsoDate, toDateInput } from "@/lib/date.utils";
import { formatDate } from "@/lib/format.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { ESTADO_CONTRATO } from "../../config/contratos.config";
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

        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
          <div>
            <p className="text-xs text-muted-foreground">
              Contrato anterior a renovar
            </p>
            <p className="text-sm font-medium">
              {contrato.fecha_fin
                ? `${formatDate(contrato.fecha_inicio)} - ${formatDate(contrato.fecha_fin)}`
                : `Desde el ${formatDate(contrato.fecha_inicio)}, sin fecha de fin`}
            </p>
          </div>
          <StatusBadge tone={ESTADO_CONTRATO[contrato.estado].tone}>
            {ESTADO_CONTRATO[contrato.estado].label}
          </StatusBadge>
        </div>

        <ContratoCampos />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Renovar"
          loadingText="Renovando…"
        />
      </form>
    </FormProvider>
  );
}
