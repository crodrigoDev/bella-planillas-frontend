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
import { getTodayIsoDate } from "@/lib/date.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useMarcacionManualGlobal } from "../../hooks/useAsistenciaActions";
import { MarcacionGlobalFormSchema } from "../../schemas/asistencia.schema";
import type { EmpleadoMarcableOption } from "../../types/marcaciones.types";
import { toMarcacionManualDto } from "../../utils/asistencia.utils";
import { MarcacionCampos } from "../MarcacionCampos";
import { ColaboradorCombobox } from "./ColaboradorCombobox";

const resolver = zodResolver(MarcacionGlobalFormSchema, zodResolverOptions);

type MarcacionValues = Parameters<typeof resolver>[0];
type MarcacionDatos = typeof MarcacionGlobalFormSchema._output;

interface RegistrarMarcacionModalProps {
  /** Resultado de la búsqueda de colaboradores; lo trae la página para no depender de otra feature */
  empleados: EmpleadoMarcableOption[];
  empleadosLoading: boolean;
  /** Se llama con el texto a buscar cuando el usuario deja de teclear */
  onSearchChange: (search: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para registrar a mano la marcación de cualquier colaborador
 *
 * @remarks
 * La fecha no puede ser futura y la hora se guarda como hora de Lima. Si el
 * mes está aprobado o cerrado, el backend la rechaza y el error se muestra
 * en el modal. El formulario está dentro del contenido: al cerrarse empieza
 * vacío la próxima vez.
 */
export function RegistrarMarcacionModal({
  empleados,
  empleadosLoading,
  onSearchChange,
  open,
  onOpenChange,
}: RegistrarMarcacionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <RegistrarMarcacionForm
          empleados={empleados}
          empleadosLoading={empleadosLoading}
          onSearchChange={onSearchChange}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface RegistrarMarcacionFormProps {
  empleados: EmpleadoMarcableOption[];
  empleadosLoading: boolean;
  onSearchChange: (search: string) => void;
  onClose: () => void;
}

function RegistrarMarcacionForm({
  empleados,
  empleadosLoading,
  onSearchChange,
  onClose,
}: RegistrarMarcacionFormProps) {
  const mutation = useMarcacionManualGlobal();

  const methods = useForm<MarcacionValues, unknown, MarcacionDatos>({
    resolver,
  });

  const onSubmit = (values: MarcacionDatos) => {
    const empleado = empleados.find(
      ({ value }) => value === values.empleado_id,
    );

    if (!empleado) return;

    mutation.mutate(
      {
        dto: toMarcacionManualDto(empleado.nro_documento, values),
        empleadoId: empleado.value,
        periodo: values.fecha.slice(0, 7),
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
          <DialogTitle>Registrar marcación</DialogTitle>
          <DialogDescription>
            Marcación manual de un colaborador. Al guardarla, el resumen de ese
            mes se actualiza.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <ColaboradorCombobox
            name="empleado_id"
            label="Colaborador"
            required
            options={empleados}
            isLoading={empleadosLoading}
            onSearchChange={onSearchChange}
            fieldClassName="col-span-full"
          />
          <MarcacionCampos maxFecha={getTodayIsoDate()} />
        </div>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Registrar"
        />
      </form>
    </FormProvider>
  );
}
