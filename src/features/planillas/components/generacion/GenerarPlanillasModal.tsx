import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GenerarPlanillasSchema,
  type GenerarPlanillasDto,
} from "@jyp/shared-contracts";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod/v3";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { SelectorMes } from "@/components/filters/SelectorMes";
import { ColaboradorCombobox } from "@/components/form/ColaboradorCombobox";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { RequiredMark } from "@/components/form/RequiredMark";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { generarUuid } from "@/lib/id.utils";
import { getPeriodoActual } from "@/lib/periodo.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useEmpleadosBusqueda } from "../../hooks/useEmpleadosOpciones";
import { useGenerarPlanillas } from "../../hooks/useGenerarPlanillas";

const ALCANCE_OPTIONS = [
  { value: "TODOS", label: "Todos los colaboradores" },
  { value: "EMPLEADO", label: "Un colaborador" },
] as const;

const GenerarPlanillasFormSchema = z
  .object({
    periodo: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "El período debe usar YYYY-MM.")
      .refine(
        (valor) => valor <= getPeriodoActual(),
        "No se pueden generar planillas de un mes futuro",
      ),
    alcance: z.enum(["TODOS", "EMPLEADO"]),
    empleado_id: z.string().optional(),
  })
  .superRefine((datos, ctx) => {
    if (datos.alcance === "EMPLEADO" && !datos.empleado_id) {
      ctx.addIssue({
        code: "custom",
        path: ["empleado_id"],
        message: "Elige un colaborador",
      });
    }
  });

const resolver = zodResolver(GenerarPlanillasFormSchema, zodResolverOptions);

type GenerarPlanillasValues = Parameters<typeof resolver>[0];
type GenerarPlanillasDatos = z.output<typeof GenerarPlanillasFormSchema>;

interface GenerarPlanillasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodoInicial: string;
  onGenerada: (trabajoId: string, periodo: string) => void;
}

/**
 * Modal para solicitar el cálculo mensual de planillas para todos o un colaborador
 *
 * @remarks
 * El formulario vive dentro del contenido: conserva la clave de solicitud al
 * reintentar un envío idéntico y genera una nueva si cambian el mes o el colaborador.
 */
export function GenerarPlanillasModal({
  open,
  onOpenChange,
  periodoInicial,
  onGenerada,
}: GenerarPlanillasModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <GenerarPlanillasForm
          periodoInicial={periodoInicial}
          onGenerada={onGenerada}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ColaboradorPlanillaField() {
  const { options, isFetching, onSearchChange } = useEmpleadosBusqueda();

  return (
    <ColaboradorCombobox
      name="empleado_id"
      label="Colaborador"
      required
      options={options}
      isLoading={isFetching}
      onSearchChange={onSearchChange}
    />
  );
}

interface GenerarPlanillasFormProps {
  periodoInicial: string;
  onGenerada: (trabajoId: string, periodo: string) => void;
  onClose: () => void;
}

function GenerarPlanillasForm({
  periodoInicial,
  onGenerada,
  onClose,
}: GenerarPlanillasFormProps) {
  // Se reutiliza la clave solo si el contenido del envío es idéntico al último intento
  const [ultimoIntento, setUltimoIntento] = useState<{
    claveEnvio: string;
    solicitudId: string;
  } | null>(null);
  const mutation = useGenerarPlanillas();

  const periodoPorDefecto =
    periodoInicial && periodoInicial <= getPeriodoActual()
      ? periodoInicial
      : getPeriodoActual();

  const methods = useForm<
    GenerarPlanillasValues,
    unknown,
    GenerarPlanillasDatos
  >({
    resolver,
    defaultValues: {
      periodo: periodoPorDefecto,
      alcance: "TODOS",
      empleado_id: "",
    },
  });

  const alcance = useWatch({ control: methods.control, name: "alcance" });

  const onSubmit = (values: GenerarPlanillasDatos) => {
    const empleadoId =
      values.alcance === "EMPLEADO" ? values.empleado_id : undefined;
    const claveEnvio = `${values.periodo}|${empleadoId ?? ""}`;
    const solicitudId =
      ultimoIntento?.claveEnvio === claveEnvio
        ? ultimoIntento.solicitudId
        : generarUuid();

    setUltimoIntento({ claveEnvio, solicitudId });

    const payload = GenerarPlanillasSchema.parse({
      periodo: values.periodo,
      solicitud_id: solicitudId,
      empleado_id: empleadoId,
    }) satisfies GenerarPlanillasDto;

    mutation.mutate(payload, {
      onSuccess: (respuesta) => {
        onGenerada(respuesta.trabajo_id, values.periodo);
        onClose();
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Generar planillas</DialogTitle>
          <DialogDescription>
            Se calcula la planilla de cada colaborador que tenga su asistencia
            del mes aprobada. Si ya existe una planilla abierta para ese mes, se
            recalcula; las planillas ya validadas no cambian y aparecerán como
            observación.
          </DialogDescription>
        </DialogHeader>

        <FormField name="periodo" label="Mes" required>
          {() => (
            <Controller
              name="periodo"
              control={methods.control}
              render={({ field }) => (
                <div className="pt-1">
                  <SelectorMes
                    periodo={field.value}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
          )}
        </FormField>

        <Field>
          <FieldTitle id="alcance-planilla-label">
            Alcance <RequiredMark />
          </FieldTitle>
          <div
            role="radiogroup"
            aria-labelledby="alcance-planilla-label"
            className="grid gap-2 sm:grid-cols-2"
          >
            {ALCANCE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input
                  type="radio"
                  value={option.value}
                  className="accent-primary"
                  {...methods.register("alcance")}
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError />
        </Field>

        {alcance === "EMPLEADO" && <ColaboradorPlanillaField />}

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Generar planillas"
          loadingText="Iniciando…"
        />
      </form>
    </FormProvider>
  );
}
