import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toDateInput } from "@/lib/date.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useEditarContrato } from "../../hooks/useContratoActions";
import { useContratoDetalle } from "../../hooks/useContratos";
import { EditarContratoFormSchema } from "../../schemas/contrato.schema";
import type { ContratoDetalle } from "../../types/contratos.types";
import { ContratoCampos } from "../ContratoCampos";

const resolver = zodResolver(EditarContratoFormSchema, zodResolverOptions);

type EditarContratoValues = Parameters<typeof resolver>[0];
type EditarContratoDatos = typeof EditarContratoFormSchema._output;

interface EditarContratoModalProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para editar un contrato que todavía no tiene PDF
 *
 * @remarks
 * El contenido está dentro del modal: al cerrarse se desmonta y el
 * formulario vuelve a empezar con los datos guardados.
 */
export function EditarContratoModal({
  contratoId,
  open,
  onOpenChange,
}: EditarContratoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <EditarContratoContent
          contratoId={contratoId}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditarContratoContentProps {
  contratoId: string;
  onClose: () => void;
}

function EditarContratoContent({
  contratoId,
  onClose,
}: EditarContratoContentProps) {
  const { data, error } = useContratoDetalle(contratoId);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Editar contrato</DialogTitle>
        <DialogDescription>
          Solo se puede editar mientras no tenga un PDF adjunto.
        </DialogDescription>
      </DialogHeader>

      {data ? (
        <EditarContratoForm contrato={data} onClose={onClose} />
      ) : error ? (
        <>
          <ErrorAlert error={error} />
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cerrar
            </DialogClose>
          </DialogFooter>
        </>
      ) : (
        <Skeleton className="h-64 w-full" />
      )}
    </>
  );
}

interface EditarContratoFormProps {
  contrato: ContratoDetalle;
  onClose: () => void;
}

function EditarContratoForm({ contrato, onClose }: EditarContratoFormProps) {
  const mutation = useEditarContrato(contrato.id);

  const methods = useForm<
    EditarContratoValues,
    unknown,
    EditarContratoDatos
  >({
    resolver,
    defaultValues: {
      tipo_modalidad: contrato.tipo_modalidad ?? undefined,
      fecha_inicio: toDateInput(contrato.fecha_inicio),
      fecha_fin: toDateInput(contrato.fecha_fin) || undefined,
      observacion: contrato.observacion ?? undefined,
    },
  });

  const onSubmit = (values: EditarContratoDatos) => {
    // Un campo vacío se envía como null para que el backend lo limpie;
    // con undefined lo dejaría como estaba
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
        <ContratoCampos />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Guardar cambios"
        />
      </form>
    </FormProvider>
  );
}
