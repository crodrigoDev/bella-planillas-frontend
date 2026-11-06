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
import { formatDate } from "@/lib/format.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  RECONOCER_SOBRETIEMPO_OPTIONS,
  RESULTADO_AUSENCIA_OPTIONS,
  TIPO_DECISION_OPTIONS,
} from "../../config/asistencia.config";
import { useResolverDia } from "../../hooks/useAsistenciaActions";
import {
  ResolverDiaFormSchema,
  toResolverDiaDto,
  type ResolverDiaFormDatos,
} from "../../schemas/asistencia.schema";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(ResolverDiaFormSchema, zodResolverOptions);

type ResolverDiaValues = Parameters<typeof resolver>[0];

interface ResolverDiaModalProps {
  empleadoId: string;
  periodo: string;
  /** Día que se resuelve (YYYY-MM-DD); null mientras el modal está cerrado */
  fecha: string | null;
  onClose: () => void;
}

/**
 * Modal para resolver un día: la ausencia, las marcaciones o el sobretiempo
 *
 * @remarks
 * Cada decisión pide un motivo y la referencia de la evidencia que la
 * respalda. Los campos que no corresponden al tipo elegido se ocultan y no se
 * envían. El formulario está dentro del contenido: al cerrarse se desmonta.
 */
export function ResolverDiaModal({
  empleadoId,
  periodo,
  fecha,
  onClose,
}: ResolverDiaModalProps) {
  return (
    <Dialog open={fecha !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        {fecha && (
          <ResolverDiaForm
            empleadoId={empleadoId}
            periodo={periodo}
            fecha={fecha}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ResolverDiaFormProps {
  empleadoId: string;
  periodo: string;
  fecha: string;
  onClose: () => void;
}

function ResolverDiaForm({
  empleadoId,
  periodo,
  fecha,
  onClose,
}: ResolverDiaFormProps) {
  const mutation = useResolverDia(empleadoId, periodo);

  const methods = useForm<ResolverDiaValues, unknown, ResolverDiaFormDatos>({
    resolver,
    // Los campos del tipo que no se eligió dejan de validarse y de enviarse
    shouldUnregister: true,
  });

  const tipo = useWatch({ control: methods.control, name: "tipo" });

  const onSubmit = (values: ResolverDiaFormDatos) =>
    mutation.mutate(toResolverDiaDto(values, empleadoId, fecha), {
      onSuccess: onClose,
    });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Resolver el día {formatDate(fecha)}</DialogTitle>
          <DialogDescription>
            Deja constancia de qué pasó ese día. Al guardar, el resumen del mes
            se actualiza.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="tipo"
            label="Qué se resuelve"
            required
            options={TIPO_DECISION_OPTIONS}
            placeholder="Selecciona una opción"
            fieldClassName="col-span-full"
          />

          {tipo === "AUSENCIA" && (
            <SelectField
              name="resultado"
              label="Resultado de la ausencia"
              required
              options={RESULTADO_AUSENCIA_OPTIONS}
              placeholder="Selecciona un resultado"
              fieldClassName="col-span-full"
            />
          )}

          {tipo === "SOBRETIEMPO" && (
            <SelectField
              name="reconocer"
              label="Sobretiempo"
              required
              options={RECONOCER_SOBRETIEMPO_OPTIONS}
              placeholder="Selecciona una opción"
              fieldClassName="col-span-full"
            />
          )}

          {tipo === "MARCACIONES" && (
            <>
              <TextField
                name="hora_entrada"
                label="Entrada"
                optional
                type="time"
              />
              <TextField
                name="hora_salida_almuerzo"
                label="Salida a almorzar"
                optional
                type="time"
              />
              <TextField
                name="hora_entrada_almuerzo"
                label="Regreso de almorzar"
                optional
                type="time"
              />
              <TextField
                name="hora_salida"
                label="Salida"
                optional
                type="time"
              />
            </>
          )}

          <TextField
            name="referencia_evidencia"
            label="Evidencia"
            required
            placeholder="Ej. Memorándum 123, certificado médico"
            fieldClassName="col-span-full"
          />
          <MotivoField placeholder="Por qué se toma esta decisión" />
        </div>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Resolver"
        />
      </form>
    </FormProvider>
  );
}
