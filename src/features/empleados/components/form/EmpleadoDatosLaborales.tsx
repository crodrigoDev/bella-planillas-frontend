import { BriefcaseBusiness, CalendarDays } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { AREAS_MOCK, CARGOS_MOCK, JORNADAS_MOCK } from "../../data/empleados.mock";
import { TURNOS } from "../../config/empleados.config";
import type { EmpleadoFormValues } from "../../types/empleado-form.types";
import EmpleadoFormSection from "./EmpleadoFormSection";
import EmpleadoInputField from "./EmpleadoInputField";
import EmpleadoSelectField from "./EmpleadoSelectField";

/** Relaciona al empleado con su puesto y permite asignarle una jornada */
export default function EmpleadoDatosLaborales({ editing = false }: { editing?: boolean }) {
  const { control, register, setValue, formState, getFieldState } = useFormContext<EmpleadoFormValues>();
  const { isSubmitting } = formState;
  const asigError = getFieldState("asig_familiar", formState).error;
  const areaId = useWatch({ control, name: "area_id" });
  const cargos = CARGOS_MOCK.filter((cargo) => cargo.id_area === areaId);

  return (
    <div className="space-y-5">
      <EmpleadoFormSection title="Puesto y jornada" icon={BriefcaseBusiness} description="* Campos obligatorios">
        <EmpleadoSelectField
          name="area_id"
          label="Área"
          options={AREAS_MOCK.map((item) => ({ value: item.id, label: item.nombre }))}
          required
          onValueChange={() => {
            // Un cambio de area exige elegir un cargo de esa area
            setValue("cargo_id", "", { shouldDirty: true });
          }}
        />
        <EmpleadoSelectField name="cargo_id" label="Cargo" options={cargos.map((item) => ({ value: item.id, label: item.nombre }))} required disabled={!areaId} placeholder={areaId ? "Selecciona un cargo" : "Selecciona primero un área"} />
        <EmpleadoInputField name="fecha_inicio" label="Fecha de ingreso" type="date" emptyValue={editing ? null : undefined} />
        <EmpleadoSelectField name="jornada_id" label="Jornada laboral" options={JORNADAS_MOCK.map((item) => ({ value: item.id, label: `${item.nombre} · ${TURNOS[item.turno] ?? item.turno}` }))} emptyLabel="Sin jornada asignada" />
        {!editing && (
          <div className="space-y-2 text-xs">
            <p className="font-medium text-foreground">Estado inicial</p>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Activo</Badge>
            <p className="text-muted-foreground">El empleado se registra como activo</p>
          </div>
        )}
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Otros datos laborales" icon={CalendarDays} description="Opcional">
        <EmpleadoInputField name="afp_fecha_filiacion" label="Fecha de afiliación a AFP" type="date" emptyValue={editing ? null : undefined} />
        <Field className="sm:col-span-2" data-invalid={Boolean(asigError)}>
          <FieldLabel htmlFor="empleado-asig_familiar" className="flex items-start gap-3 rounded-lg border p-4">
            <input {...register("asig_familiar")} id="empleado-asig_familiar" type="checkbox" disabled={isSubmitting} className="mt-0.5 size-4 shrink-0 accent-primary" />
            <span className="space-y-1">
              <span className="block text-xs font-medium">Asignación familiar</span>
              <span className="block text-xs font-normal leading-relaxed text-muted-foreground">Indica si el empleado cuenta con asignación familiar</span>
            </span>
          </FieldLabel>
          <FieldError errors={[asigError]} className="text-xs" />
        </Field>
      </EmpleadoFormSection>
    </div>
  );
}
