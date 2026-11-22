import type { FormEventHandler } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActualizarAreaSchema, CrearAreaSchema } from "@jyp/shared-contracts";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { TextField } from "@/components/form/TextField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useCrearArea, useEditarArea } from "../../hooks/useAreaActions";
import type { AreaResumenDto } from "../../types/areas.types";

const crearResolver = zodResolver(CrearAreaSchema, zodResolverOptions);
const actualizarResolver = zodResolver(
  ActualizarAreaSchema,
  zodResolverOptions,
);

type CrearAreaValues = Parameters<typeof crearResolver>[0];
type CrearAreaDatos = typeof CrearAreaSchema._output;
type ActualizarAreaValues = Parameters<typeof actualizarResolver>[0];
type ActualizarAreaDatos = typeof ActualizarAreaSchema._output;

interface AreaFormModalProps {
  /** Área a editar; si es null se registra una nueva */
  area: AreaResumenDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para crear o editar un área
 *
 * @remarks
 * El formulario vive dentro del contenido: al cerrarse se desmonta y
 * empieza limpio la próxima vez.
 */
export function AreaFormModal({
  area,
  open,
  onOpenChange,
}: AreaFormModalProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        {area ? (
          <EditarAreaForm key={area.id} area={area} onClose={handleClose} />
        ) : (
          <CrearAreaForm key="nueva" onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CrearAreaFormProps {
  onClose: () => void;
}

function CrearAreaForm({ onClose }: CrearAreaFormProps) {
  const mutation = useCrearArea();

  const methods = useForm<CrearAreaValues, unknown, CrearAreaDatos>({
    resolver: crearResolver,
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = (values: CrearAreaDatos) => {
    mutation.mutate(
      {
        nombre: values.nombre,
        descripcion: values.descripcion || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <AreaFormLayout
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      title="Nueva área"
      description="Registra un área para organizar los cargos, jornadas y colaboradores."
      submitLabel="Crear área"
      isPending={mutation.isPending}
      error={mutation.error}
    />
  );
}

interface EditarAreaFormProps {
  area: AreaResumenDto;
  onClose: () => void;
}

function EditarAreaForm({ area, onClose }: EditarAreaFormProps) {
  const mutation = useEditarArea(area.id);

  const methods = useForm<ActualizarAreaValues, unknown, ActualizarAreaDatos>({
    resolver: actualizarResolver,
    defaultValues: {
      nombre: area.nombre,
      descripcion: area.descripcion ?? "",
    },
  });

  const onSubmit = (values: ActualizarAreaDatos) => {
    // Una descripción vacía se envía como null para que se borre en lugar de conservar la anterior
    mutation.mutate(
      {
        nombre: values.nombre,
        descripcion: values.descripcion || null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <AreaFormLayout
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      title="Editar área"
      description="Actualiza el nombre o la descripción del área."
      submitLabel="Guardar cambios"
      isPending={mutation.isPending}
      error={mutation.error}
    />
  );
}

interface AreaFormLayoutProps<
  TValues extends FieldValues,
  TDatos extends FieldValues,
> {
  methods: UseFormReturn<TValues, unknown, TDatos>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  description: string;
  submitLabel: string;
  isPending: boolean;
  error: unknown;
}

function AreaFormLayout<
  TValues extends FieldValues,
  TDatos extends FieldValues,
>({
  methods,
  onSubmit,
  title,
  description,
  submitLabel,
  isPending,
  error,
}: AreaFormLayoutProps<TValues, TDatos>) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AreaCampos />

        <ErrorAlert error={error} />

        <ModalFormFooter isPending={isPending} submitLabel={submitLabel} />
      </form>
    </FormProvider>
  );
}

function AreaCampos() {
  const { register } = useFormContext();

  return (
    <>
      <TextField
        name="nombre"
        label="Nombre"
        required
        maxLength={100}
        placeholder="Ej. Operaciones y Logística"
      />

      <FormField name="descripcion" label="Descripción">
        {(invalid) => (
          <Textarea
            id="descripcion"
            maxLength={255}
            placeholder="Describe brevemente las funciones o alcance del área"
            aria-invalid={invalid}
            {...register("descripcion")}
          />
        )}
      </FormField>
    </>
  );
}
