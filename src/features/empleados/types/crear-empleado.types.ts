import type { FieldPathByValue } from "react-hook-form";
import type { RegistroEmpleadoSchema } from "../schemas/registro-empleado.schema";

// El formulario admite campos vacios y el schema aplica los valores por defecto al guardar
export type CrearEmpleadoFormValues = typeof RegistroEmpleadoSchema["_input"];
export type RegistroEmpleadoDto = typeof RegistroEmpleadoSchema["_output"];

export type EmpleadoInputFieldName = FieldPathByValue<
  CrearEmpleadoFormValues,
  string | number | null | undefined
>;

export type EmpleadoTextFieldName = FieldPathByValue<
  CrearEmpleadoFormValues,
  string | null | undefined
>;
