import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { SelectorMes } from "@/components/filters/SelectorMes";
import { ColaboradorCombobox } from "@/components/form/ColaboradorCombobox";
import { FormField } from "@/components/form/FormField";
import { FormSection } from "@/components/form/FormSection";
import { LoadingButton } from "@/components/form/LoadingButton";
import { RequiredMark } from "@/components/form/RequiredMark";
import { TextField } from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldTitle,
} from "@/components/ui/field";
import { generarUuid } from "@/lib/id.utils";
import type { ColaboradorOption } from "@/lib/types/options.types";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  CONCEPTOS_PLAME,
  TIPOS_EXPORTACION_OPCIONES,
} from "../../config/exportaciones.config";
import { useSolicitarExportacion } from "../../hooks/useExportacionActions";
import {
  CONCEPTOS_PLAME_VACIOS,
  NuevaExportacionFormSchema,
  toSolicitarExportacionDto,
  type NuevaExportacionDatos,
} from "../../schemas/exportacion.schema";

const ALCANCE_OPCIONES = [
  { value: "TODOS", label: "Todos los colaboradores" },
  { value: "COLABORADOR", label: "Un colaborador" },
] as const;

const resolver = zodResolver(NuevaExportacionFormSchema, zodResolverOptions);
type NuevaExportacionValues = Parameters<typeof resolver>[0];

interface NuevaExportacionFormProps {
  periodoInicial: string;
  colaboradores: {
    options: ColaboradorOption[];
    isLoading: boolean;
    onSearchChange: (search: string) => void;
  };
  onSolicitada: (id: string) => void;
}

function ConfirmacionPagoPlameField() {
  const { control, register } = useFormContext<NuevaExportacionValues>();
  const { errors } = useFormState({ control, name: "confirmarMontosPagados" });
  const error = errors.confirmarMontosPagados;

  return (
    <Field className="col-span-full" data-invalid={Boolean(error)}>
      <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-primary"
          aria-invalid={Boolean(error)}
          {...register("confirmarMontosPagados")}
        />
        <span>
          Confirmo que los montos de este mes ya se pagaron y descontaron{" "}
          <RequiredMark />
        </span>
      </label>
      <FieldDescription>
        Validar la planilla no confirma su pago.
      </FieldDescription>
      <FieldError errors={[error]} />
    </Field>
  );
}

interface ConceptosPlamePlegableProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ConceptosPlamePlegable({
  open,
  onOpenChange,
}: ConceptosPlamePlegableProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
      className="col-span-full space-y-3"
    >
      <CollapsibleTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        Códigos de la Tabla 22
        {open ? (
          <ChevronUpIcon data-icon="inline-end" />
        ) : (
          <ChevronDownIcon data-icon="inline-end" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Solo hace falta para los conceptos que tienen monto en el mes; el
          resto ya tiene su código.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {CONCEPTOS_PLAME.map(({ campo, label }) => (
            <TextField
              key={campo}
              name={`conceptosPlame.${campo}`}
              label={label}
              maxLength={4}
              inputMode="numeric"
              placeholder="4 dígitos"
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Formulario para elegir el formato, mes, alcance y opciones de una exportación mensual
 */
export function NuevaExportacionForm({
  periodoInicial,
  colaboradores,
  onSolicitada,
}: NuevaExportacionFormProps) {
  const [plameAbierto, setPlameAbierto] = useState(false);
  const [ultimoIntento, setUltimoIntento] = useState<{
    claveEnvio: string;
    idempotencia: string;
    periodo: string;
  } | null>(null);
  const solicitar = useSolicitarExportacion();

  const methods = useForm<
    NuevaExportacionValues,
    unknown,
    NuevaExportacionDatos
  >({
    resolver,
    defaultValues: {
      tipo: "COSTOS",
      periodo: periodoInicial,
      alcance: "TODOS",
      empleadoId: "",
      confirmarMontosPagados: false,
      conceptosPlame: CONCEPTOS_PLAME_VACIOS,
    },
  });

  const tipo = useWatch({ control: methods.control, name: "tipo" });
  const alcance = useWatch({ control: methods.control, name: "alcance" });
  const periodo = useWatch({ control: methods.control, name: "periodo" });

  const esErrorSinValidar =
    isAxiosError<{ detail?: unknown }>(solicitar.error) &&
    solicitar.error.response?.status === 409 &&
    typeof solicitar.error.response.data?.detail === "string" &&
    solicitar.error.response.data.detail.startsWith("Debe validar");

  const periodoErrorPlanillas = ultimoIntento?.periodo ?? periodo;

  const handleSubmit = (valores: NuevaExportacionDatos) => {
    const dtoBase = toSolicitarExportacionDto(valores, generarUuid());
    const claveEnvio = JSON.stringify({
      tipo: dtoBase.tipo,
      periodo: dtoBase.periodo,
      empleado_id: dtoBase.empleado_id ?? null,
      configuracion: dtoBase.configuracion,
    });

    // Se conserva la misma clave mientras el formulario no cambie, incluso ante reintentos de error 409 o red
    const idempotencia =
      ultimoIntento?.claveEnvio === claveEnvio
        ? ultimoIntento.idempotencia
        : dtoBase.idempotencia;

    setUltimoIntento({
      claveEnvio,
      idempotencia,
      periodo: valores.periodo,
    });

    solicitar.mutate(
      { ...dtoBase, idempotencia },
      {
        onSuccess: (respuesta) => {
          setUltimoIntento(null);
          onSolicitada(respuesta.id);
        },
      },
    );
  };

  const handleInvalidSubmit = (errors: FieldErrors<NuevaExportacionValues>) => {
    if (errors.conceptosPlame) {
      setPlameAbierto(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit, handleInvalidSubmit)}
        noValidate
        className="space-y-6"
      >
        <FormSection
          title="Formato"
          description="Elige el tipo de archivo que necesitas generar."
        >
          <Field className="col-span-full">
            <FieldTitle id="tipo-exportacion-label">
              Tipo de exportación <RequiredMark />
            </FieldTitle>
            <div
              role="radiogroup"
              aria-labelledby="tipo-exportacion-label"
              className="grid gap-3 md:grid-cols-3"
            >
              {TIPOS_EXPORTACION_OPCIONES.map((opcion) => (
                <label
                  key={opcion.tipo}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm has-checked:border-primary has-checked:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                >
                  <input
                    type="radio"
                    value={opcion.tipo}
                    className="mt-0.5 accent-primary"
                    {...methods.register("tipo")}
                  />
                  <span className="space-y-1">
                    <span className="block font-medium text-foreground">
                      {opcion.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {opcion.descripcion}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Field>
        </FormSection>

        <FormSection
          title="Mes y alcance"
          description="Solo se puede exportar un mes con todas sus planillas validadas."
        >
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

          <Field className="col-span-full">
            <FieldTitle id="alcance-exportacion-label">
              Alcance <RequiredMark />
            </FieldTitle>
            <div
              role="radiogroup"
              aria-labelledby="alcance-exportacion-label"
              className="grid gap-2 sm:max-w-md sm:grid-cols-2"
            >
              {ALCANCE_OPCIONES.map((opcion) => (
                <label
                  key={opcion.value}
                  className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                >
                  <input
                    type="radio"
                    value={opcion.value}
                    className="accent-primary"
                    {...methods.register("alcance")}
                  />
                  {opcion.label}
                </label>
              ))}
            </div>
          </Field>

          {alcance === "COLABORADOR" && (
            <ColaboradorCombobox
              name="empleadoId"
              label="Colaborador"
              required
              options={colaboradores.options}
              isLoading={colaboradores.isLoading}
              onSearchChange={colaboradores.onSearchChange}
              fieldClassName="col-span-full sm:max-w-md"
            />
          )}
        </FormSection>

        {tipo === "PLAME" && (
          <FormSection
            title="Opciones de PLAME"
            description="Confirmación de pago y códigos contables opcionales de la Tabla 22."
          >
            <ConfirmacionPagoPlameField />
            <ConceptosPlamePlegable
              open={plameAbierto}
              onOpenChange={setPlameAbierto}
            />
          </FormSection>
        )}

        <ErrorAlert
          error={solicitar.error}
          title="No se pudo generar la exportación"
          action={
            esErrorSinValidar ? (
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    to={`${ROUTE_PATHS.nomina.planillas}?periodo=${periodoErrorPlanillas}`}
                  />
                }
              >
                Ver planillas del mes
              </Button>
            ) : undefined
          }
        />

        <div className="flex justify-end">
          <LoadingButton
            type="submit"
            isLoading={solicitar.isPending}
            loadingText="Iniciando…"
          >
            Generar exportación
          </LoadingButton>
        </div>
      </form>
    </FormProvider>
  );
}
