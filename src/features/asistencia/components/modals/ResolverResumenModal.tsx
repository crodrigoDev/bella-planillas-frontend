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
import { useResolverResumen } from "../../hooks/useAsistenciaActions";
import { ResolverResumenFormSchema } from "../../schemas/asistencia.schema";
import { formatPeriodo } from "../../utils/asistencia.utils";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(ResolverResumenFormSchema, zodResolverOptions);

type ResolverResumenValues = Parameters<typeof resolver>[0];
type ResolverResumenDatos = typeof ResolverResumenFormSchema._output;

/** Lo que se hace con el resumen: rechazar un pendiente o reabrir uno aprobado o rechazado */
export type AccionResumen = "RECHAZAR" | "REABRIR";

const TEXTOS: Record<
  AccionResumen,
  { titulo: string; descripcion: string; boton: string }
> = {
  RECHAZAR: {
    titulo: "Rechazar resumen",
    descripcion:
      "El resumen quedará rechazado y habrá que corregir lo que haga falta y volver a calcularlo.",
    boton: "Rechazar",
  },
  REABRIR: {
    titulo: "Reabrir resumen",
    descripcion:
      "El resumen vuelve a pendiente y se podrán registrar marcaciones y resolver días de nuevo.",
    boton: "Reabrir",
  },
};

interface ResolverResumenModalProps {
  empleadoId: string;
  periodo: string;
  accion: AccionResumen;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para rechazar o reabrir el resumen de un mes, con su motivo
 *
 * @remarks
 * El formulario está dentro del contenido: al cerrarse se desmonta y
 * empieza vacío la próxima vez.
 */
export function ResolverResumenModal({
  empleadoId,
  periodo,
  accion,
  open,
  onOpenChange,
}: ResolverResumenModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <ResolverResumenForm
          empleadoId={empleadoId}
          periodo={periodo}
          accion={accion}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ResolverResumenFormProps {
  empleadoId: string;
  periodo: string;
  accion: AccionResumen;
  onClose: () => void;
}

function ResolverResumenForm({
  empleadoId,
  periodo,
  accion,
  onClose,
}: ResolverResumenFormProps) {
  const mutation = useResolverResumen();
  const textos = TEXTOS[accion];

  const methods = useForm<ResolverResumenValues, unknown, ResolverResumenDatos>(
    { resolver },
  );

  const onSubmit = ({ motivo }: ResolverResumenDatos) =>
    mutation.mutate(
      { empleado_id: empleadoId, periodo, accion, motivo },
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
            {textos.titulo} de {formatPeriodo(periodo)}
          </DialogTitle>
          <DialogDescription>{textos.descripcion}</DialogDescription>
        </DialogHeader>

        <MotivoField />

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel={textos.boton}
          variant={accion === "RECHAZAR" ? "destructive" : "default"}
        />
      </form>
    </FormProvider>
  );
}
