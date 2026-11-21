import { zodResolver } from "@hookform/resolvers/zod";
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
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useGuardarDiaCalendario } from "../../hooks/useCalendario";
import { CambiarEstadoDiaFormSchema } from "../../schemas/asistencia.schema";
import type { DiaCalendarioAsistencia } from "../../types/calendario.types";
import { formatFechaCompleta } from "../../utils/asistencia.utils";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(CambiarEstadoDiaFormSchema, zodResolverOptions);

type CambiarEstadoValues = Parameters<typeof resolver>[0];
type CambiarEstadoDatos = typeof CambiarEstadoDiaFormSchema._output;

interface CambiarEstadoDiaModalProps {
  /** Día acordado que se activa o desactiva; null mientras está cerrado */
  dia: DiaCalendarioAsistencia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para activar o desactivar un día acordado
 *
 * @remarks
 * Solo pide el motivo: el resto del día se vuelve a enviar igual, porque el
 * backend guarda con un upsert por fecha. El formulario está dentro del
 * contenido, así que se desmonta al cerrarse.
 */
export function CambiarEstadoDiaModal({
  dia,
  open,
  onOpenChange,
}: CambiarEstadoDiaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        {dia && (
          <CambiarEstadoDiaForm
            dia={dia}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CambiarEstadoDiaFormProps {
  dia: DiaCalendarioAsistencia;
  onClose: () => void;
}

function CambiarEstadoDiaForm({ dia, onClose }: CambiarEstadoDiaFormProps) {
  const mutation = useGuardarDiaCalendario();
  const desactivar = dia.activo;

  const methods = useForm<CambiarEstadoValues, unknown, CambiarEstadoDatos>({
    resolver,
  });

  const onSubmit = ({ motivo }: CambiarEstadoDatos) =>
    mutation.mutate(
      {
        dto: {
          fecha: dia.fecha,
          nombre: dia.nombre,
          motivo,
          activo: !dia.activo,
        },
        accion: desactivar ? "DESACTIVAR" : "ACTIVAR",
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
          <DialogTitle>
            {desactivar ? "Desactivar día acordado" : "Activar día acordado"}
          </DialogTitle>
          <DialogDescription>
            {desactivar
              ? "El día dejará de contar como descanso para todos los colaboradores."
              : "El día volverá a contar como descanso para todos los colaboradores."}{" "}
            Se guarda el cambio en «{dia.nombre}». Fecha:{" "}
            {formatFechaCompleta(dia.fecha)}.
          </DialogDescription>
        </DialogHeader>

        <MotivoField
          placeholder={
            desactivar
              ? "Por qué se desactiva el día"
              : "Por qué se activa el día"
          }
        />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel={desactivar ? "Desactivar" : "Activar"}
          variant={desactivar ? "destructive" : "default"}
        />
      </form>
    </FormProvider>
  );
}
