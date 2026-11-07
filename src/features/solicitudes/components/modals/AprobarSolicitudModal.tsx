import { FormProvider, useForm } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { SelectField } from "@/components/form/SelectField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EFECTO_ELEGIBLE_OPTIONS,
  LIMITES,
  TIPOS_CON_FECHAS,
} from "../../config/solicitudes.config";
import { useEvaluarSolicitud } from "../../hooks/useSolicitudActions";
import {
  aprobarConEfectoResolver,
  aprobarResolver,
  type AprobarDatos,
  type AprobarValues,
} from "../../schemas/evaluacion.schema";
import type { SolicitudAccionable } from "../../types/solicitudes.types";
import {
  getEfectoAprobacion,
  requiereEfectoAsistencia,
} from "../../utils/solicitudes.utils";
import { ObservacionCampo } from "./ObservacionCampo";

interface AprobarSolicitudModalProps {
  solicitud: SolicitudAccionable;
  /** Nombre del colaborador, para el aviso de actualizar su asistencia */
  colaboradorNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para aprobar una solicitud
 *
 * @remarks
 * Licencia médica, permiso y justificación piden elegir si el tiempo es con o
 * sin goce (si no, el motor de asistencia no justifica los días). Vacaciones
 * se aprueban siempre con goce y el resto no afecta la asistencia. Aprobar no
 * recalcula el resumen de asistencia: el modal avisa que hay que actualizarlo.
 * El formulario está dentro del contenido: al cerrarse empieza vacío.
 */
export function AprobarSolicitudModal({
  solicitud,
  colaboradorNombre,
  open,
  onOpenChange,
}: AprobarSolicitudModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <AprobarSolicitudForm
          solicitud={solicitud}
          colaboradorNombre={colaboradorNombre}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AprobarSolicitudFormProps {
  solicitud: SolicitudAccionable;
  colaboradorNombre: string;
  onClose: () => void;
}

function AprobarSolicitudForm({
  solicitud,
  colaboradorNombre,
  onClose,
}: AprobarSolicitudFormProps) {
  const mutation = useEvaluarSolicitud(solicitud.id, solicitud.codigo);
  const pideEfecto = requiereEfectoAsistencia(solicitud.tipo);
  const afectaAsistencia = TIPOS_CON_FECHAS.includes(solicitud.tipo);

  const methods = useForm<AprobarValues, unknown, AprobarDatos>({
    resolver: pideEfecto ? aprobarConEfectoResolver : aprobarResolver,
    defaultValues: { observacion: "" },
  });

  const onSubmit = (datos: AprobarDatos) =>
    mutation.mutate(
      {
        estado: "APROBADA",
        efecto_asistencia: getEfectoAprobacion(
          solicitud.tipo,
          datos.efecto_asistencia,
        ),
        observacion: datos.observacion || undefined,
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
          <DialogTitle>Aprobar la solicitud {solicitud.codigo}</DialogTitle>
          <DialogDescription>
            {solicitud.tipo === "VACACIONES"
              ? "Las vacaciones se aprueban con goce de haber."
              : "Confirma la aprobación de la solicitud."}
          </DialogDescription>
        </DialogHeader>

        {pideEfecto && (
          <SelectField
            name="efecto_asistencia"
            label="Efecto en la asistencia"
            required
            options={EFECTO_ELEGIBLE_OPTIONS}
            description="Con goce o sin goce de haber en los días solicitados."
          />
        )}

        <ObservacionCampo
          name="observacion"
          label="Observación (opcional)"
          maxLength={LIMITES.observacion.max}
        />

        {afectaAsistencia && (
          <p className="rounded-lg border border-warning-border bg-warning-soft p-3 text-sm text-warning-soft-foreground">
            Aprobar no recalcula la asistencia: actualiza el resumen del mes
            desde la ficha de {colaboradorNombre}.
          </p>
        )}

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Aprobar"
          loadingText="Aprobando…"
        />
      </form>
    </FormProvider>
  );
}
