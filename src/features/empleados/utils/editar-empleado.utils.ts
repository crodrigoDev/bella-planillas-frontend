import { EditarEmpleadoSchema } from "@jyp/shared-contracts";
import type { EditarEmpleadoFormValues } from "../types/empleado-form.types";
import type { EmpleadoMock } from "../types/empleados.types";

/** Prepara los campos del contrato y convierte las fechas para los inputs */
export function getEditarEmpleadoDefaults(empleado: EmpleadoMock): EditarEmpleadoFormValues {
  const values = Object.fromEntries(
    Object.keys(EditarEmpleadoSchema.shape).map((key) => [key, Reflect.get(empleado, key)]),
  );
  for (const key of ["fecha_inicio", "fecha_nacimiento", "afp_fecha_filiacion"]) {
    const date = values[key];
    values[key] = typeof date === "string" ? date.slice(0, 10) : null;
  }
  // Los campos opcionales usan valores vacios para poder completarlos o borrarlos
  return EditarEmpleadoSchema.parse({
    ...values,
    estado_civil: empleado.estado_civil ?? "SOLTERO",
    nacionalidad: empleado.nacionalidad ?? "PERUANA",
    asig_familiar: empleado.asig_familiar ?? false,
  });
}
