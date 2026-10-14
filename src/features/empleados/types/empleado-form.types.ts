import type { EditarEmpleadoSchema } from "@jyp/shared-contracts";
import type { FieldPathByValue } from "react-hook-form";
import type { CrearEmpleadoFormValues } from "./crear-empleado.types";
import type { ContratoFormValues } from "./contrato-empleado.types";
import type { FinancieroFormValues } from "./financiero-empleado.types";

export type EditarEmpleadoFormValues = typeof EditarEmpleadoSchema["_input"];

// Los campos comunes sirven tanto al registro como a la edicion
export type EmpleadoFormValues = CrearEmpleadoFormValues | EditarEmpleadoFormValues | ContratoFormValues | FinancieroFormValues;
export type EmpleadoInputName = FieldPathByValue<EmpleadoFormValues, string | number | null | undefined>;
export type EmpleadoSelectName = FieldPathByValue<EmpleadoFormValues, string | null | undefined>;
