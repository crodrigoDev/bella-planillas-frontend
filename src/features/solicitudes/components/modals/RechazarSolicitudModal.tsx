import { FormProvider, useForm } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LIMITES } from "../../config/solicitudes.config";
import { useEvaluarSolicitud } from "../../hooks/useSolicitudActions";
import {
  rechazarResolver,
  type RechazarDatos,
  type RechazarValues,
} from "../../schemas/evaluacion.schema";
import { ObservacionCampo } from "./ObservacionCampo";

interface RechazarSolicitudModalProps {
  /** Solicitud a rechazar */
  solicitud: { id: string; codigo: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para rechazar una solicitud, con su motivo obligatorio
 *
 * @remarks
 * El formulario está dentro del contenido: al cerrarse se desmonta y empieza
 * vacío la próxima vez.
 */
export function RechazarSolicitudModal({
  solicitud,
  open,
  onOpenChange,
}: RechazarSolicitudModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <RechazarSolicitudForm
          solicitud={solicitud}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RechazarSolicitudFormProps {
  solicitud: { id: string; codigo: string };
  onClose: () => void;
}

function RechazarSolicitudForm({
  solicitud,
  onClose,
}: RechazarSolicitudFormProps) {
  const mutation = useEvaluarSolicitud(solicitud.id, solicitud.codigo);

  const methods = useForm<RechazarValues, unknown, RechazarDatos>({
    resolver: rechazarResolver,
    defaultValues: { observacion: "" },
  });

  const onSubmit = ({ observacion }: RechazarDatos) =>
    mutation.mutate({ estado: "RECHAZADA", observacion }, { onSuccess: onClose });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Rechazar la solicitud {solicitud.codigo}</DialogTitle>
          <DialogDescription>
            La solicitud quedará rechazada y no se podrá volver a evaluar.
          </DialogDescription>
        </DialogHeader>

        <ObservacionCampo
          name="observacion"
          label="Motivo del rechazo"
          required
          maxLength={LIMITES.rechazo.max}
        />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Rechazar"
          loadingText="Rechazando…"
          variant="destructive"
        />
      </form>
    </FormProvider>
  );
}
