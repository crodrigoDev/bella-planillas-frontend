import { FormProvider, useForm } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format.utils";
import { TIPO_NOVEDAD_LABELS } from "../../config/novedades.config";
import { useResolverNovedad } from "../../hooks/useNovedadActions";
import {
  resolverNovedadResolver,
  type ResolverNovedadDatos,
  type ResolverNovedadValues,
} from "../../schemas/novedad.schema";
import type { AccionNovedad, NovedadPlanilla } from "../../types/novedades.types";

const CONFIG_ACCION: Record<
  AccionNovedad,
  {
    titulo: string;
    etiquetaMotivo: string;
    placeholder: string;
    submitLabel: string;
    loadingText: string;
    variant: "default" | "destructive";
  }
> = {
  APROBADO: {
    titulo: "Aprobar novedad",
    etiquetaMotivo: "Motivo de la aprobación",
    placeholder: "Indica el detalle o conformidad de la aprobación",
    submitLabel: "Aprobar",
    loadingText: "Aprobando…",
    variant: "default",
  },
  RECHAZADO: {
    titulo: "Rechazar novedad",
    etiquetaMotivo: "Motivo del rechazo",
    placeholder: "Explica por qué se rechaza esta novedad",
    submitLabel: "Rechazar",
    loadingText: "Rechazando…",
    variant: "destructive",
  },
  ANULADO: {
    titulo: "Anular novedad",
    etiquetaMotivo: "Motivo de la anulación",
    placeholder: "Explica por qué se anula esta novedad",
    submitLabel: "Anular",
    loadingText: "Anulando…",
    variant: "destructive",
  },
};

const getTextoEfecto = (
  accion: AccionNovedad,
  novedad: NovedadPlanilla,
): string => {
  if (accion === "APROBADO") {
    return "Se aplicará cuando recalcules la planilla.";
  }

  if (accion === "RECHAZADO") {
    return "No se aplicará en la planilla.";
  }

  return novedad.estado === "APROBADO"
    ? "Dejará de aplicarse cuando recalcules la planilla."
    : "Se retira sin aplicarse.";
};

interface ResolverNovedadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  novedad: NovedadPlanilla | null;
  accion: AccionNovedad | null;
}

/**
 * Modal para aprobar, rechazar o anular una novedad con su motivo obligatorio
 *
 * @remarks
 * El formulario vive dentro del contenido: al cerrarse se desmonta y empieza
 * limpio la próxima vez.
 */
export function ResolverNovedadModal({
  open,
  onOpenChange,
  novedad,
  accion,
}: ResolverNovedadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        {novedad && accion && (
          <ResolverNovedadForm
            key={`${novedad.id}-${accion}`}
            novedad={novedad}
            accion={accion}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ResolverNovedadFormProps {
  novedad: NovedadPlanilla;
  accion: AccionNovedad;
  onClose: () => void;
}

function ResolverNovedadForm({
  novedad,
  accion,
  onClose,
}: ResolverNovedadFormProps) {
  const mutation = useResolverNovedad();
  const config = CONFIG_ACCION[accion];
  const efecto = getTextoEfecto(accion, novedad);
  const nota =
    accion === "APROBADO"
      ? "Si luego encuentras un error, podrás anularla y registrar otra."
      : "Esta acción no se puede deshacer; para corregir una novedad, anúlala y registra otra.";

  const methods = useForm<
    ResolverNovedadValues,
    unknown,
    ResolverNovedadDatos
  >({
    resolver: resolverNovedadResolver,
    defaultValues: { motivo: "" },
  });

  const onSubmit = ({ motivo }: ResolverNovedadDatos) => {
    mutation.mutate(
      {
        id: novedad.id,
        dto: {
          version: novedad.version,
          estado: accion,
          motivo,
        },
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
          <DialogTitle>{config.titulo}</DialogTitle>
          <DialogDescription>
            {efecto} {nota}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 rounded-lg border bg-muted/40 p-3 text-sm">
          <div className="flex items-center justify-between gap-2 font-medium">
            <span>{TIPO_NOVEDAD_LABELS[novedad.tipo]}</span>
            <span className="tabular-nums">
              {formatCurrency(Number(novedad.monto))}
            </span>
          </div>
          <p className="text-muted-foreground">{novedad.motivo}</p>
        </div>

        <FormField
          name="motivo"
          label={config.etiquetaMotivo}
          required
          description="Entre 5 y 1000 caracteres."
        >
          {(invalid) => (
            <Textarea
              id="motivo"
              maxLength={1000}
              placeholder={config.placeholder}
              aria-invalid={invalid}
              {...methods.register("motivo")}
            />
          )}
        </FormField>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel={config.submitLabel}
          loadingText={config.loadingText}
          variant={config.variant}
        />
      </form>
    </FormProvider>
  );
}
