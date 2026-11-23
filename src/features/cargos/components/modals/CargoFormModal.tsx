import type { FormEventHandler } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

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
import type { SelectOption } from "@/lib/types/options.types";
import { useCrearCargo, useEditarCargo } from "../../hooks/useCargoActions";
import {
  cargoResolver,
  SUELDO_MINIMO_DEFECTO,
  type CargoFormDatos,
  type CargoFormValues,
} from "../../schemas/cargo.schema";
import type { CargoResumenDto } from "../../types/cargos.types";
import { toCargoDto } from "../../utils/cargos.utils";

interface CargoFormModalProps {
  /** Cargo a editar; si es null se registra uno nuevo */
  cargo: CargoResumenDto | null;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[];
  areasLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para crear o editar un cargo
 *
 * @remarks
 * El formulario vive dentro del contenido: al cerrarse se desmonta y
 * empieza limpio la próxima vez.
 */
export function CargoFormModal({
  cargo,
  areas,
  areasLoading,
  open,
  onOpenChange,
}: CargoFormModalProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        {cargo ? (
          <EditarCargoForm
            key={cargo.id}
            cargo={cargo}
            areas={areas}
            areasLoading={areasLoading}
            onClose={handleClose}
          />
        ) : (
          <CrearCargoForm
            key="nuevo"
            areas={areas}
            areasLoading={areasLoading}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CrearCargoFormProps {
  areas: SelectOption[];
  areasLoading: boolean;
  onClose: () => void;
}

function CrearCargoForm({
  areas,
  areasLoading,
  onClose,
}: CrearCargoFormProps) {
  const mutation = useCrearCargo();

  const methods = useForm<CargoFormValues, unknown, CargoFormDatos>({
    resolver: cargoResolver,
    defaultValues: {
      id_area: "",
      nombre: "",
      descripcion: "",
      sueldo_minimo: SUELDO_MINIMO_DEFECTO,
      sueldo_maximo: "",
    },
  });

  const onSubmit = (values: CargoFormDatos) => {
    mutation.mutate(toCargoDto(values), { onSuccess: onClose });
  };

  return (
    <CargoFormLayout
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      areas={areas}
      areasLoading={areasLoading}
      title="Nuevo cargo"
      description="Registra un cargo dentro de un área y define su banda salarial."
      submitLabel="Crear cargo"
      isPending={mutation.isPending}
      error={mutation.error}
    />
  );
}

interface EditarCargoFormProps {
  cargo: CargoResumenDto;
  areas: SelectOption[];
  areasLoading: boolean;
  onClose: () => void;
}

function EditarCargoForm({
  cargo,
  areas,
  areasLoading,
  onClose,
}: EditarCargoFormProps) {
  const mutation = useEditarCargo(cargo.id);

  const methods = useForm<CargoFormValues, unknown, CargoFormDatos>({
    resolver: cargoResolver,
    defaultValues: {
      id_area: cargo.id_area,
      nombre: cargo.nombre,
      descripcion: cargo.descripcion ?? "",
      sueldo_minimo:
        cargo.sueldo_minimo !== null ? String(Number(cargo.sueldo_minimo)) : "",
      sueldo_maximo:
        cargo.sueldo_maximo !== null ? String(Number(cargo.sueldo_maximo)) : "",
    },
  });

  const onSubmit = (values: CargoFormDatos) => {
    mutation.mutate(toCargoDto(values, true), { onSuccess: onClose });
  };

  return (
    <CargoFormLayout
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      areas={areas}
      areasLoading={areasLoading}
      title="Editar cargo"
      description="Actualiza el área, los datos o la banda salarial del cargo."
      submitLabel="Guardar cambios"
      isPending={mutation.isPending}
      error={mutation.error}
    />
  );
}

interface CargoFormLayoutProps {
  methods: UseFormReturn<CargoFormValues, unknown, CargoFormDatos>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  areas: SelectOption[];
  areasLoading: boolean;
  title: string;
  description: string;
  submitLabel: string;
  isPending: boolean;
  error: unknown;
}

function CargoFormLayout({
  methods,
  onSubmit,
  areas,
  areasLoading,
  title,
  description,
  submitLabel,
  isPending,
  error,
}: CargoFormLayoutProps) {
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <CargoCampos areas={areas} areasLoading={areasLoading} />

        <ErrorAlert error={error} />

        <ModalFormFooter isPending={isPending} submitLabel={submitLabel} />
      </form>
    </FormProvider>
  );
}

interface CargoCamposProps {
  areas: SelectOption[];
  areasLoading: boolean;
}

function CargoCampos({ areas, areasLoading }: CargoCamposProps) {
  const { register } = useFormContext();

  return (
    <>
      <SelectField
        name="id_area"
        label="Área"
        required
        options={areas}
        isLoading={areasLoading}
        placeholder="Selecciona un área"
      />

      <TextField
        name="nombre"
        label="Nombre"
        required
        maxLength={100}
        placeholder="Ej. Analista de Nómina"
      />

      <FormField name="descripcion" label="Descripción">
        {(invalid) => (
          <Textarea
            id="descripcion"
            maxLength={255}
            placeholder="Describe brevemente las funciones o responsabilidades del cargo"
            aria-invalid={invalid}
            {...register("descripcion")}
          />
        )}
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="sueldo_minimo"
          label="Sueldo mínimo (S/)"
          required
          type="text"
          inputMode="decimal"
          placeholder="1130.00"
        />

        <TextField
          name="sueldo_maximo"
          label="Sueldo máximo (S/)"
          type="text"
          inputMode="decimal"
          placeholder="Opcional"
        />
      </div>
    </>
  );
}
