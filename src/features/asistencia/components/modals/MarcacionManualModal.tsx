import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
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
import { getTodayIsoDate } from "@/lib/date.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { TIPO_MARCA_OPTIONS } from "../../config/asistencia.config";
import { useMarcacionManual } from "../../hooks/useAsistenciaActions";
import { MarcacionManualFormSchema } from "../../schemas/asistencia.schema";
import {
  formatPeriodo,
  getRangoPeriodo,
  toFechaHoraLima,
} from "../../utils/asistencia.utils";
import { AvisoJornada } from "../AvisoJornada";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(MarcacionManualFormSchema, zodResolverOptions);

type MarcacionValues = Parameters<typeof resolver>[0];
type MarcacionDatos = typeof MarcacionManualFormSchema._output;

interface MarcacionManualModalProps {
  empleadoId: string;
  /** Documento del empleado: el backend identifica la marcación por él */
  nroDocumento: string;
  periodo: string;
  /** Fechas del mes que no tienen jornada asignada; la marcación se guarda igual */
  fechasSinJornada: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para registrar a mano una marcación del mes que se está viendo
 *
 * @remarks
 * La fecha se limita al mes mostrado y no puede ser futura. La hora se
 * guarda como hora de Lima. El formulario está dentro del contenido: al
 * cerrarse se desmonta y empieza vacío la próxima vez.
 */
export function MarcacionManualModal({
  empleadoId,
  nroDocumento,
  periodo,
  fechasSinJornada,
  open,
  onOpenChange,
}: MarcacionManualModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <MarcacionManualForm
          empleadoId={empleadoId}
          nroDocumento={nroDocumento}
          periodo={periodo}
          fechasSinJornada={fechasSinJornada}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface MarcacionManualFormProps {
  empleadoId: string;
  nroDocumento: string;
  periodo: string;
  fechasSinJornada: string[];
  onClose: () => void;
}

function MarcacionManualForm({
  empleadoId,
  nroDocumento,
  periodo,
  fechasSinJornada,
  onClose,
}: MarcacionManualFormProps) {
  const mutation = useMarcacionManual(empleadoId, periodo);

  const rango = getRangoPeriodo(periodo);
  const hoy = getTodayIsoDate();
  const maxFecha = rango.fin < hoy ? rango.fin : hoy;

  const methods = useForm<MarcacionValues, unknown, MarcacionDatos>({
    resolver,
  });

  // La marcación es un hecho y se guarda; solo se avisa que aún no se calcula
  const fecha = useWatch({ control: methods.control, name: "fecha" });
  const sinJornada = !!fecha && fechasSinJornada.includes(fecha);

  const onSubmit = (values: MarcacionDatos) =>
    mutation.mutate(
      {
        nro_documento: nroDocumento,
        fecha_hora: toFechaHoraLima(values.fecha, values.hora),
        tipo_marcacion: values.tipo_marcacion,
        motivo: values.motivo,
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
          <DialogTitle>Registrar marcación</DialogTitle>
          <DialogDescription>
            Marcación manual de {formatPeriodo(periodo)}. Al guardarla, el
            resumen del mes se actualiza.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="fecha"
            label="Fecha"
            required
            type="date"
            min={rango.inicio}
            max={maxFecha}
          />
          <TextField name="hora" label="Hora" required type="time" />
          <SelectField
            name="tipo_marcacion"
            label="Tipo de marcación"
            required
            options={TIPO_MARCA_OPTIONS}
            placeholder="Selecciona un tipo"
            fieldClassName="col-span-full"
          />
          <MotivoField placeholder="Por qué se registra a mano" />
        </div>

        {sinJornada && (
          <AvisoJornada>
            Se guardará, pero no se calculará hasta asignar una jornada.
          </AvisoJornada>
        )}

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Registrar"
        />
      </form>
    </FormProvider>
  );
}
