import { RegistroEmpleadoSchema } from "./registro-empleado.schema";

// Reutiliza los campos del contrato y la comprobacion de sus fechas
export const ContratoEmpleadoFormSchema = RegistroEmpleadoSchema.pick({ contrato: true });
