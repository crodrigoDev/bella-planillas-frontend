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
import { useAnularSolicitud } from "../../hooks/useSolicitudActions";
import {
  anularResolver,
  type AnularDatos,
  type AnularValues,
} from "../../schemas/evaluacion.schema";
import { ObservacionCampo } from "./ObservacionCampo";

interface AnularSolicitudModalProps {
  /** Solicitud a anular */
  solicitud: { id: string; codigo: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para anular una solicitud pendiente o en revisión, con su motivo obligatorio
 *
 * @remarks
 * Cualquier usuario de RRHH puede anular, no solo el responsable. El
 * formulario está dentro del contenido: al cerrarse empieza vacío.
 */
export function AnularSolicitudModal({
  solicitud,
  open,
  onOpenChange,
}: AnularSolicitudModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <AnularSolicitudForm
          solicitud={solicitud}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AnularSolicitudFormProps {
  solicitud: { id: string; codigo: string };
  onClose: () => void;
}

function AnularSolicitudForm({ solicitud, onClose }: AnularSolicitudFormProps) {
  const mutation = useAnularSolicitud(solicitud.id, solicitud.codigo);

  const methods = useForm<AnularValues, unknown, AnularDatos>({
    resolver: anularResolver,
    defaultValues: { motivo: "" },
  });

  const onSubmit = ({ motivo }: AnularDatos) =>
    mutation.mutate(motivo, { onSuccess: onClose });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Anular la solicitud {solicitud.codigo}</DialogTitle>
          <DialogDescription>
            La solicitud quedará anulada y no se podrá revertir.
          </DialogDescription>
        </DialogHeader>

        <ObservacionCampo
          name="motivo"
          label="Motivo de la anulación"
          required
          maxLength={LIMITES.anulacion.max}
        />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Anular"
          loadingText="Anulando…"
          variant="destructive"
        />
      </form>
    </FormProvider>
  );
}
