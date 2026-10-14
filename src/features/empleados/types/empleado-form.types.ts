import type { EditarEmpleadoSchema } from "@jyp/shared-contracts";
import type { FieldPathByValue } from "react-hook-form";
import type { CrearEmpleadoFormValues } from "./crear-empleado.types";

export type EditarEmpleadoFormValues = typeof EditarEmpleadoSchema["_input"];

// Los campos comunes sirven tanto al registro como a la edicion
export type EmpleadoFormValues = CrearEmpleadoFormValues | EditarEmpleadoFormValues;
export type EmpleadoInputName = FieldPathByValue<EmpleadoFormValues, string | number | null | undefined>;
export type EmpleadoSelectName = FieldPathByValue<EmpleadoFormValues, string | null | undefined>;
