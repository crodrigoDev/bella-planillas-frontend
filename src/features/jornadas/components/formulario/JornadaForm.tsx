import { FormProvider, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";
import { SaveIcon } from "lucide-react";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormSection } from "@/components/form/FormSection";
import { LoadingButton } from "@/components/form/LoadingButton";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Button } from "@/components/ui/button";
import type { SelectOption } from "@/lib/types/options.types";
import {
  DIAS_SEMANA,
  DURACION_OPTIONS,
  MODALIDAD_OPTIONS,
  TURNO_OPTIONS,
} from "../../config/jornadas.config";
import { useJornadaForm } from "../../hooks/useJornadaForm";
import type { JornadaDetalle } from "../../types/jornadas.types";
import { AreasCampo } from "./AreasCampo";
import { AvisoCompatibilidadAsistencia } from "./AvisoCompatibilidadAsistencia";
import { HorarioSemanalCampos } from "./HorarioSemanalCampos";
import { PatronRotacionCampos } from "./PatronRotacionCampos";

interface JornadaFormProps {
  /** La jornada a editar; sin ella el formulario crea una nueva */
  jornada?: JornadaDetalle;
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[] | undefined;
  areasLoading: boolean;
}

/**
 * Formulario para crear o editar una jornada
 *
 * @remarks
 * Para editar, la jornada ya debe estar cargada: se usa como valores iniciales
 * y el formulario no se actualiza si cambia después. El patrón de rotación
 * solo aparece con turno rotativo. El aviso de compatibilidad con asistencia
 * no bloquea el guardado.
 */
export function JornadaForm({
  jornada,
  areas,
  areasLoading,
}: JornadaFormProps) {
  const { methods, handleSubmit, isPending, error } = useJornadaForm(jornada);
  const turno = useWatch({ control: methods.control, name: "turno" });
  const isEdicion = Boolean(jornada);

  // Presencial o remoto fijan la modalidad de los siete días
  const sincronizarModalidadDias = (modalidad: string | undefined) => {
    if (modalidad !== "PRESENCIAL" && modalidad !== "REMOTO") return;

    DIAS_SEMANA.forEach((_, index) =>
      methods.setValue(`horario_semanal.${index}.modalidad`, modalidad, {
        shouldDirty: true,
      }),
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormSection
          title="Datos generales"
          description="Cómo se llama la jornada y sus reglas de puntualidad."
        >
          <TextField
            name="nombre"
            label="Nombre"
            required
            fieldClassName="sm:col-span-2"
            maxLength={100}
          />
          <TextField
            name="tolerancia_minutos"
            label="Tolerancia (minutos)"
            type="number"
            min={0}
            max={60}
            description="Minutos de gracia al marcar la entrada."
          />
          <TextField
            name="descripcion"
            label="Descripción"
            optional
            fieldClassName="col-span-full"
            maxLength={255}
          />
          <SelectField
            name="duracion"
            label="Duración"
            required
            options={DURACION_OPTIONS}
          />
          <SelectField
            name="turno"
            label="Turno"
            required
            options={TURNO_OPTIONS}
          />
          <SelectField
            name="modalidad"
            label="Modalidad"
            required
            options={MODALIDAD_OPTIONS}
            description="Con híbrido se elige la modalidad de cada día."
            onValueChange={sincronizarModalidadDias}
          />
        </FormSection>

        <FormSection
          title="Áreas"
          description="Las áreas cuyos empleados pueden tener esta jornada."
        >
          <AreasCampo areas={areas} isLoading={areasLoading} />
        </FormSection>

        <FormSection
          title="Horario semanal"
          description="Las horas de cada día. Los días sin marcar como laborables son de descanso."
        >
          <HorarioSemanalCampos />
        </FormSection>

        {turno === "ROTATIVO" && (
          <FormSection
            title="Patrón de rotación"
            description="Cómo se alternan los turnos del personal con esta jornada."
          >
            <PatronRotacionCampos />
          </FormSection>
        )}

        <AvisoCompatibilidadAsistencia />

        <ErrorAlert error={error} title="No se pudo guardar la jornada" />

        <StepperFooter
          progressLabel={isEdicion ? "Editando jornada" : "Nueva jornada"}
          cancelAction={
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to={ROUTE_PATHS.asistencia.jornadas} />}
              disabled={isPending}
            >
              Cancelar
            </Button>
          }
        >
          <LoadingButton
            type="submit"
            isLoading={isPending}
            loadingText="Guardando…"
            icon={SaveIcon}
          >
            {isEdicion ? "Guardar cambios" : "Crear jornada"}
          </LoadingButton>
        </StepperFooter>
      </form>
    </FormProvider>
  );
}
