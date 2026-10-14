import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearJornadaSchema,
  DiaSemanaEnum,
  DuracionJornadaEnum,
  TurnoJornadaEnum,
  ModalidadJornadaEnum,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModuleField from "@/components/modules/ModuleField";
import ModuleSelect from "@/components/modules/ModuleSelect";
import { enumItems } from "@/components/modules/module.utils";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";
import type {
  JornadaFormValues,
  JornadaListado,
} from "../types/jornadas.types";
import JornadaHorarioFields from "./JornadaHorarioFields";

/** Captura los datos, areas y siete dias que solicita el backend */
export default function JornadaFormDialog({
  jornada,
  onClose,
  onSave,
}: {
  jornada?: JornadaListado;
  onClose: () => void;
  onSave: (values: CrearJornadaDto) => void;
}) {
  const form = useForm<JornadaFormValues, unknown, CrearJornadaDto>({
    resolver: zodResolver(CrearJornadaSchema),
    defaultValues: jornada ?? {
      nombre: "",
      descripcion: "",
      duracion: "TIEMPO_COMPLETO",
      turno: "MANANA",
      modalidad: "PRESENCIAL",
      tolerancia_minutos: 5,
      areas_ids: [AREAS_MOCK[0].id],
      activo: true,
      patron_rotacion: null,
      horario_semanal: DiaSemanaEnum.options.map((dia, index) => ({
        dia,
        laborable: index < 5,
        modalidad: "PRESENCIAL",
        entrada: index < 5 ? "08:00" : null,
        inicio_descanso: index < 5 ? "13:00" : null,
        fin_descanso: index < 5 ? "14:00" : null,
        salida: index < 5 ? "17:00" : null,
        total_horas: 0,
      })),
    },
  });
  const turno = useWatch({ control: form.control, name: "turno" });
  const { errors } = form.formState;
  const submit = (values: CrearJornadaDto): void => {
    try {
      onSave(values);
      onClose();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la jornada",
      });
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {jornada ? "Editar jornada" : "Nueva jornada"}
          </DialogTitle>
          <DialogDescription>Horario y áreas donde se aplica</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(submit)}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <ModuleField
                id="jornada-nombre"
                label="Nombre"
                error={errors.nombre}
              >
                <Input id="jornada-nombre" {...form.register("nombre")} />
              </ModuleField>
              <ModuleField
                id="jornada-descripcion"
                label="Descripción"
                error={errors.descripcion}
              >
                <Input
                  id="jornada-descripcion"
                  {...form.register("descripcion")}
                />
              </ModuleField>
              <Controller
                name="duracion"
                control={form.control}
                render={({ field }) => (
                  <ModuleSelect
                    label="Duración"
                    value={field.value ?? "TIEMPO_COMPLETO"}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    items={enumItems(DuracionJornadaEnum.options)}
                  />
                )}
              />
              <Controller
                name="turno"
                control={form.control}
                render={({ field }) => (
                  <ModuleSelect
                    label="Turno"
                    value={field.value ?? "MANANA"}
                    onChange={(value) => {
                      field.onChange(value);
                      // Prepara un patron editable cuando el turno es rotativo
                      form.setValue(
                        "patron_rotacion",
                        value === "ROTATIVO"
                          ? {
                              tipo_ciclo: "5x2",
                              dias_trabajo: 5,
                              dias_descanso: 2,
                              frecuencia_cambio: "SEMANAL",
                              turnos_base: ["MANANA", "TARDE"],
                            }
                          : null,
                      );
                    }}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    items={enumItems(TurnoJornadaEnum.options)}
                  />
                )}
              />
              <Controller
                name="modalidad"
                control={form.control}
                render={({ field }) => (
                  <ModuleSelect
                    label="Modalidad"
                    value={field.value ?? "PRESENCIAL"}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value !== "HIBRIDO")
                        form
                          .getValues("horario_semanal")
                          .forEach((_, index) =>
                            form.setValue(
                              `horario_semanal.${index}.modalidad`,
                              value === "REMOTO" ? "REMOTO" : "PRESENCIAL",
                            ),
                          );
                    }}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    items={enumItems(ModalidadJornadaEnum.options)}
                  />
                )}
              />
              <ModuleField
                id="jornada-tolerancia"
                label="Tolerancia (minutos)"
                error={errors.tolerancia_minutos}
              >
                <Input
                  id="jornada-tolerancia"
                  type="number"
                  min={0}
                  max={60}
                  {...form.register("tolerancia_minutos", {
                    valueAsNumber: true,
                  })}
                />
              </ModuleField>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-medium">
                Áreas aplicables
              </legend>
              <div className="flex flex-wrap gap-3">
                {AREAS_MOCK.map((area) => (
                  <label
                    key={area.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <input
                      type="checkbox"
                      value={area.id}
                      {...form.register("areas_ids")}
                    />
                    {area.nombre}
                  </label>
                ))}
              </div>
              {errors.areas_ids && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.areas_ids.message}
                </p>
              )}
            </fieldset>
            {turno === "ROTATIVO" && (
              <fieldset className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
                <legend className="px-1 text-xs">Patrón de rotación</legend>
                <ModuleField id="ciclo" label="Ciclo (ej. 5x2)">
                  <Input
                    id="ciclo"
                    {...form.register("patron_rotacion.tipo_ciclo")}
                  />
                </ModuleField>
                <ModuleField id="trabajo" label="Días de trabajo">
                  <Input
                    id="trabajo"
                    type="number"
                    {...form.register("patron_rotacion.dias_trabajo", {
                      valueAsNumber: true,
                    })}
                  />
                </ModuleField>
                <ModuleField id="descanso" label="Días de descanso">
                  <Input
                    id="descanso"
                    type="number"
                    {...form.register("patron_rotacion.dias_descanso", {
                      valueAsNumber: true,
                    })}
                  />
                </ModuleField>
                <Controller
                  name="patron_rotacion.frecuencia_cambio"
                  control={form.control}
                  render={({ field }) => (
                    <ModuleSelect
                      label="Cambio de turno"
                      value={field.value ?? "SEMANAL"}
                      onChange={field.onChange}
                      items={enumItems(["SEMANAL", "QUINCENAL", "MENSUAL"])}
                    />
                  )}
                />
                <Controller
                  name="patron_rotacion.turnos_base"
                  control={form.control}
                  render={({ field }) => (
                    <div className="space-y-2 sm:col-span-2">
                      <p className="text-xs font-medium">Turnos base</p>
                      <div className="flex flex-wrap gap-3">
                        {enumItems(["MANANA", "TARDE", "NOCHE"]).map((item) => (
                          <label
                            key={item.value}
                            className="flex gap-1 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={
                                field.value?.includes(item.value) ?? false
                              }
                              onChange={(event) =>
                                field.onChange(
                                  event.target.checked
                                    ? [...(field.value ?? []), item.value]
                                    : field.value?.filter(
                                        (value) => value !== item.value,
                                      ),
                                )
                              }
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                />
              </fieldset>
            )}
            <JornadaHorarioFields />
            {(errors.horario_semanal || errors.patron_rotacion) && (
              <p role="alert" className="text-xs text-destructive">
                Revisa las horas y el patrón de rotación
              </p>
            )}
            {errors.root && (
              <p role="alert" className="text-xs text-destructive">
                {errors.root.message}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar jornada</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
