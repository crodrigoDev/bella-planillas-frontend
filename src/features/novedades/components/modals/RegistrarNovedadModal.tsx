import { FormProvider, useForm, useWatch } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatPeriodo } from "@/lib/periodo.utils";
import {
  TIPO_NOVEDAD_AYUDA,
  TIPO_NOVEDAD_OPTIONS,
} from "../../config/novedades.config";
import { useRegistrarNovedad } from "../../hooks/useNovedadActions";
import {
  registrarNovedadResolver,
  type RegistrarNovedadDatos,
  type RegistrarNovedadValues,
} from "../../schemas/novedad.schema";
import type { TipoNovedad } from "../../types/novedades.types";

interface RegistrarNovedadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empleadoId: string;
  periodo: string;
  nombre: string;
}

/**
 * Modal para registrar una novedad de planilla para un colaborador en un mes
 *
 * @remarks
 * El formulario vive dentro del contenido: al cerrarse se desmonta y empieza
 * limpio la próxima vez.
 */
export function RegistrarNovedadModal({
  open,
  onOpenChange,
  empleadoId,
  periodo,
  nombre,
}: RegistrarNovedadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <RegistrarNovedadForm
          empleadoId={empleadoId}
          periodo={periodo}
          nombre={nombre}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RegistrarNovedadFormProps {
  empleadoId: string;
  periodo: string;
  nombre: string;
  onClose: () => void;
}

function RegistrarNovedadForm({
  empleadoId,
  periodo,
  nombre,
  onClose,
}: RegistrarNovedadFormProps) {
  const mutation = useRegistrarNovedad();

  const methods = useForm<
    RegistrarNovedadValues,
    unknown,
    RegistrarNovedadDatos
  >({
    resolver: registrarNovedadResolver,
    defaultValues: {
      tipo: "" as TipoNovedad,
      monto: "",
      motivo: "",
      referencia_evidencia: "",
    },
  });

  const tipoSeleccionado = useWatch({
    control: methods.control,
    name: "tipo",
  });

  const ayudaTipo = tipoSeleccionado
    ? TIPO_NOVEDAD_AYUDA[tipoSeleccionado]
    : undefined;

  const onSubmit = (valores: RegistrarNovedadDatos) => {
    mutation.mutate(
      {
        empleado_id: empleadoId,
        periodo,
        ...valores,
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
          <DialogTitle>Registrar novedad</DialogTitle>
          <DialogDescription>
            {nombre} · {formatPeriodo(periodo)}
          </DialogDescription>
        </DialogHeader>

        <SelectField
          name="tipo"
          label="Tipo"
          required
          options={TIPO_NOVEDAD_OPTIONS}
          placeholder="Selecciona un tipo"
          description={ayudaTipo}
        />

        <TextField
          name="monto"
          label="Monto (S/)"
          required
          type="text"
          inputMode="decimal"
          placeholder="0.00"
        />

        <FormField
          name="motivo"
          label="Motivo"
          required
          description="Entre 5 y 1000 caracteres."
        >
          {(invalid) => (
            <Textarea
              id="motivo"
              maxLength={1000}
              placeholder="Explica la razón del bono o descuento"
              aria-invalid={invalid}
              {...methods.register("motivo")}
            />
          )}
        </FormField>

        <TextField
          name="referencia_evidencia"
          label="Sustento"
          required
          maxLength={255}
          placeholder="Ej. Memorando 045-2026"
          description="N.° de memorando, correo o documento que respalda la novedad."
        />

        <p className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
          Queda pendiente hasta que la apruebes. Mientras esté pendiente no se
          puede calcular la planilla de este colaborador. Una vez aprobada, se
          aplica al recalcular la planilla.
        </p>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Registrar novedad"
          loadingText="Registrando…"
        />
      </form>
    </FormProvider>
  );
}
