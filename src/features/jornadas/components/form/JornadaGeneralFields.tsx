import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  DuracionJornadaEnum,
  ModalidadJornadaEnum,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ModuleField from "@/components/modules/ModuleField";
import { enumItems } from "@/components/modules/module.utils";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import type { JornadaFormValues } from "../../types/jornadas.types";
import { JORNADA_ROTACION_DEFAULT } from "../../config/jornada-form.config";
import JornadaChoiceGroup from "./JornadaChoiceGroup";

/** Captura los datos comunes de una jornada con opciones del contrato */
export default function JornadaGeneralFields() {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<JornadaFormValues, unknown, CrearJornadaDto>();
  const turno = useWatch({ control, name: "turno" });
  return (
    <div className="space-y-6">
      <ModuleField
        id="jornada-nombre"
        label="Nombre de la jornada *"
        error={errors.nombre}
      >
        <Input
          id="jornada-nombre"
          placeholder="Ej. Jornada estándar, Turno de tarde…"
          maxLength={100}
          {...register("nombre")}
        />
      </ModuleField>
      <ModuleField
        id="jornada-descripcion"
        label="Descripción (opcional)"
        error={errors.descripcion}
      >
        <Textarea
          id="jornada-descripcion"
          placeholder="Descripción breve de la jornada…"
          maxLength={255}
          {...register("descripcion")}
        />
      </ModuleField>
      <Controller
        name="duracion"
        control={control}
        render={({ field }) => (
          <JornadaChoiceGroup
            label="Duración *"
            value={field.value ?? "TIEMPO_COMPLETO"}
            items={enumItems(DuracionJornadaEnum.options)}
            onChange={field.onChange}
          />
        )}
      />
      <p className="-mt-4 text-[11px] text-muted-foreground">
        Tiempo parcial: menos de 30 h semanales · Máximo semanal: 48 h
      </p>
      <Controller
        name="modalidad"
        control={control}
        render={({ field }) => (
          <JornadaChoiceGroup
            label="Modalidad base *"
            value={field.value ?? "PRESENCIAL"}
            items={enumItems(ModalidadJornadaEnum.options)}
            onChange={(value) => {
              field.onChange(value);
              if (value !== "HIBRIDO")
                getValues("horario_semanal").forEach((_, index) =>
                  setValue(
                    `horario_semanal.${index}.modalidad`,
                    value === "REMOTO" ? "REMOTO" : "PRESENCIAL",
                  ),
                );
            }}
          />
        )}
      />
      <JornadaChoiceGroup
        label="Patrón *"
        value={turno === "ROTATIVO" ? "ROTATIVO" : "FIJO"}
        items={[
          { value: "FIJO", label: "Fijo" },
          { value: "ROTATIVO", label: "Rotativo" },
        ]}
        onChange={(value) => {
          setValue("turno", value === "ROTATIVO" ? "ROTATIVO" : "MANANA", {
            shouldDirty: true,
          });
          setValue(
            "patron_rotacion",
            value === "ROTATIVO"
              ? {
                  ...JORNADA_ROTACION_DEFAULT,
                  turnos_base: [...JORNADA_ROTACION_DEFAULT.turnos_base],
                }
              : null,
            { shouldDirty: true },
          );
        }}
      />
      {turno !== "ROTATIVO" && (
        <Controller
          name="turno"
          control={control}
          render={({ field }) => (
            <JornadaChoiceGroup
              label="Turno *"
              value={field.value ?? "MANANA"}
              items={enumItems(["MANANA", "TARDE", "NOCHE", "MIXTO"])}
              onChange={field.onChange}
            />
          )}
        />
      )}
      <ModuleField
        id="jornada-tolerancia"
        label="Tolerancia de entrada (minutos)"
        error={errors.tolerancia_minutos}
      >
        <div className="flex items-center gap-2">
          <Input
            id="jornada-tolerancia"
            className="w-24"
            type="number"
            min={0}
            max={60}
            {...register("tolerancia_minutos", { valueAsNumber: true })}
          />
          <span className="text-[11px] text-muted-foreground">
            minutos de gracia al ingreso
          </span>
        </div>
      </ModuleField>
      <Controller
        name="areas_ids"
        control={control}
        render={({ field }) => (
          <fieldset className="space-y-2">
            <legend className="mb-2 text-xs font-medium">
              Áreas aplicables *
            </legend>
            <div className="flex flex-wrap gap-2">
              {AREAS_MOCK.map((area) => (
                <Button
                  key={area.id}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={field.value.includes(area.id)}
                  onClick={() =>
                    field.onChange(
                      field.value.includes(area.id)
                        ? field.value.filter((id) => id !== area.id)
                        : [...field.value, area.id],
                    )
                  }
                  className={
                    field.value.includes(area.id)
                      ? "border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground"
                  }
                >
                  {area.nombre}
                </Button>
              ))}
            </div>
            {errors.areas_ids && (
              <p role="alert" className="text-xs text-destructive">
                {errors.areas_ids.message}
              </p>
            )}
          </fieldset>
        )}
      />
      <Controller
        name="activo"
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Switch
              id="jornada-activo"
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
            />
            <label htmlFor="jornada-activo" className="space-y-1 text-xs">
              <span className="block font-medium">
                Estado: {field.value ? "Activa" : "Inactiva"}
              </span>
              <span className="block text-[11px] text-muted-foreground">
                La plantilla activa estará disponible para los empleados de las
                áreas seleccionadas
              </span>
            </label>
          </div>
        )}
      />
    </div>
  );
}
