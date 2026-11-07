import { FormProvider, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { SaveIcon } from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ColaboradorCombobox } from "@/components/form/ColaboradorCombobox";
import { FileDropzone } from "@/components/form/FileDropzone";
import { FormSection } from "@/components/form/FormSection";
import { LoadingButton } from "@/components/form/LoadingButton";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import type { ColaboradorOption } from "@/lib/types/options.types";
import {
  LIMITES,
  SUSTENTO_ACCEPT,
  TIPO_OPTIONS,
  TIPOS_CON_FECHAS,
  TIPOS_CON_MONTO,
} from "../../config/solicitudes.config";
import { useSolicitudForm } from "../../hooks/useSolicitudForm";
import { ObservacionCampo } from "../modals/ObservacionCampo";
import { PeriodoCampos } from "./PeriodoCampos";

interface SolicitudFormProps {
  /** Resultado de la búsqueda de colaboradores activos; lo trae la página para no depender de otra feature */
  empleados: ColaboradorOption[];
  empleadosLoading: boolean;
  /** Se llama con el texto a buscar cuando el usuario deja de teclear */
  onEmpleadoSearchChange: (search: string) => void;
}

/**
 * Formulario para registrar una solicitud a nombre de un colaborador
 *
 * @remarks
 * Los campos de fechas, horas, días y monto aparecen según el tipo. El
 * sustento (PDF o Word de hasta 5 MB) es opcional. Al guardar abre el detalle
 * de la solicitud creada. El colaborador debe estar activo: con uno inactivo
 * el backend responde 404.
 */
export function SolicitudForm({
  empleados,
  empleadosLoading,
  onEmpleadoSearchChange,
}: SolicitudFormProps) {
  const {
    methods,
    handleSubmit,
    archivo,
    setArchivo,
    archivoError,
    isPending,
    error,
  } = useSolicitudForm();
  const tipo = useWatch({ control: methods.control, name: "tipo" });
  const porHoras = useWatch({ control: methods.control, name: "por_horas" });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormSection
          title="Solicitud"
          description="A quién corresponde y de qué tipo es."
        >
          <ColaboradorCombobox
            name="empleado_id"
            label="Colaborador"
            required
            options={empleados}
            isLoading={empleadosLoading}
            onSearchChange={onEmpleadoSearchChange}
            fieldClassName="sm:col-span-2"
          />
          <SelectField
            name="tipo"
            label="Tipo de solicitud"
            required
            options={TIPO_OPTIONS}
          />
        </FormSection>

        {tipo && TIPOS_CON_FECHAS.includes(tipo) && (
          <FormSection
            title="Periodo"
            description="Los días que cubre la solicitud."
          >
            <PeriodoCampos tipo={tipo} porHoras={porHoras} />
          </FormSection>
        )}

        {tipo && TIPOS_CON_MONTO.includes(tipo) && (
          <FormSection
            title="Monto"
            description="El adelanto que pide el colaborador, en soles."
          >
            <TextField
              name="monto"
              label="Monto (S/)"
              type="number"
              step="0.01"
              min={0}
              required
            />
          </FormSection>
        )}

        <FormSection
          title="Detalle"
          description="El motivo y, si hace falta, una observación para quien la revise."
        >
          <ObservacionCampo
            name="motivo"
            label="Motivo"
            required
            maxLength={LIMITES.motivo.max}
            className="col-span-full"
          />
          <ObservacionCampo
            name="observacion"
            label="Observación (opcional)"
            maxLength={LIMITES.observacion.max}
            className="col-span-full"
          />
        </FormSection>

        <FormSection
          title="Sustento"
          description="Un PDF o un documento de Word de hasta 5 MB. Es opcional."
        >
          <Field className="col-span-full">
            <FieldLabel htmlFor="sustento">Archivo de sustento</FieldLabel>
            <FileDropzone
              id="sustento"
              file={archivo}
              onChange={setArchivo}
              accept={SUSTENTO_ACCEPT}
              hint="PDF, DOC o DOCX, máximo 5 MB"
              invalid={Boolean(archivoError)}
              disabled={isPending}
            />
            {archivoError && <FieldError>{archivoError}</FieldError>}
          </Field>
        </FormSection>

        <ErrorAlert error={error} title="No se pudo registrar la solicitud" />

        <StepperFooter
          progressLabel="Nueva solicitud"
          cancelAction={
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to={ROUTE_PATHS.gestionPersonal.solicitudes} />}
              disabled={isPending}
            >
              Cancelar
            </Button>
          }
        >
          <LoadingButton
            type="submit"
            isLoading={isPending}
            loadingText="Registrando…"
            icon={SaveIcon}
            disabled={Boolean(archivoError)}
          >
            Registrar solicitud
          </LoadingButton>
        </StepperFooter>
      </form>
    </FormProvider>
  );
}
