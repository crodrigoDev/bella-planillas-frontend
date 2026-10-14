import type { CrearContratoDto } from "@jyp/shared-contracts";
import type { ContratoEmpleadoFormSchema } from "../schemas/contrato-empleado.schema";
import type { ContratoEmpleado } from "./ficha-empleado.types";

export type ContratoFormValues = typeof ContratoEmpleadoFormSchema["_input"];
export type ContratoFormDto = typeof ContratoEmpleadoFormSchema["_output"];
export type ContratoMock = CrearContratoDto & { id: string; url?: string | null; deleted_at?: string | null };
export type ContratoFormMode = "crear" | "editar" | "renovar";
export type ContratoAction = { type: "crear" } | { type: "editar" | "renovar" | "anular"; contrato: ContratoEmpleado };

export interface ContratoActions {
  onEdit: (contrato: ContratoEmpleado) => void;
  onRenew: (contrato: ContratoEmpleado) => void;
  onCancel: (contrato: ContratoEmpleado) => void;
}
