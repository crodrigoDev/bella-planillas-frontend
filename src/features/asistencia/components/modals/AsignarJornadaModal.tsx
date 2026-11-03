import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
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
import { toDateInput } from "@/lib/date.utils";
import type { SelectOption } from "@/lib/types/options.types";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { POLITICA_TOLERANCIA_OPTIONS } from "../../config/asistencia.config";
import { useAsignarJornada } from "../../hooks/useAsistenciaActions";
import { AsignarJornadaFormSchema } from "../../schemas/asistencia.schema";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(AsignarJornadaFormSchema, zodResolverOptions);

type AsignarJornadaValues = Parameters<typeof resolver>[0];
type AsignarJornadaDatos = typeof AsignarJornadaFormSchema._output;

interface AsignarJornadaModalProps {
  empleadoId: string;
  periodo: string;
  /** Jornadas activas; las trae la página, porque el catálogo vive en `empleados` */
  jornadas: SelectOption[] | undefined;
  isLoadingJornadas: boolean;
  /** Inicio de labores del empleado: la jornada no puede empezar antes */
  fechaInicioLabores: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para asignar una jornada al empleado desde una fecha
 *
 * @remarks
 * El backend solo admite jornadas fijas diurnas, y no deja empezar antes del
 * ingreso ni repetir la fecha de inicio de otra asignación. Cuando el empleado
 * ya tiene historial de asistencia, la jornada se cambia solo desde aquí. El
 * formulario está dentro del contenido: al cerrarse se desmonta.
 */
export function AsignarJornadaModal({
  empleadoId,
  periodo,
  jornadas,
  isLoadingJornadas,
  fechaInicioLabores,
  open,
  onOpenChange,
}: AsignarJornadaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <AsignarJornadaForm
          empleadoId={empleadoId}
          periodo={periodo}
          jornadas={jornadas}
          isLoadingJornadas={isLoadingJornadas}
          fechaInicioLabores={fechaInicioLabores}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface AsignarJornadaFormProps {
  empleadoId: string;
  periodo: string;
  jornadas: SelectOption[] | undefined;
  isLoadingJornadas: boolean;
  fechaInicioLabores: string | null;
  onClose: () => void;
}

function AsignarJornadaForm({
  empleadoId,
  periodo,
  jornadas,
  isLoadingJornadas,
  fechaInicioLabores,
  onClose,
}: AsignarJornadaFormProps) {
  const mutation = useAsignarJornada(empleadoId, periodo);

  const methods = useForm<AsignarJornadaValues, unknown, AsignarJornadaDatos>({
    resolver,
    defaultValues: { politica_tolerancia: "COMPLETA" },
  });

  const onSubmit = (values: AsignarJornadaDatos) =>
    mutation.mutate(
      { ...values, empleado_id: empleadoId },
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
          <DialogTitle>Asignar jornada</DialogTitle>
          <DialogDescription>
            La jornada rige desde la fecha que indiques y queda en el historial.
            Solo se admiten jornadas fijas de día.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="jornada_id"
            label="Jornada"
            required
            options={jornadas}
            placeholder="Selecciona una jornada"
            isLoading={isLoadingJornadas}
            fieldClassName="col-span-full"
          />
          <TextField
            name="desde"
            label="Desde"
            required
            type="date"
            min={toDateInput(fechaInicioLabores) || undefined}
          />
          <TextField name="hasta" label="Hasta" optional type="date" />
          <SelectField
            name="politica_tolerancia"
            label="Tardanza que supera la tolerancia"
            options={POLITICA_TOLERANCIA_OPTIONS}
            fieldClassName="col-span-full"
          />
          <MotivoField placeholder="Por qué cambia la jornada" />
        </div>

        <ErrorAlert error={mutation.error} />

        <DialogFooter>
          <DialogClose
            render={<Button type="button" variant="outline" />}
            disabled={mutation.isPending}
          >
            Cancelar
          </DialogClose>
          <LoadingButton
            type="submit"
            isLoading={mutation.isPending}
            loadingText="Guardando…"
          >
            Asignar
          </LoadingButton>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
