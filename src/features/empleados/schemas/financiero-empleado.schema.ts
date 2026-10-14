import { ActualizarDatoFinancieroSchema } from "@jyp/shared-contracts";
import { RegistroEmpleadoSchema } from "./registro-empleado.schema";

export const CrearFinancieroFormSchema = RegistroEmpleadoSchema.pick({ financiero: true });

// La edicion admite cambios parciales y exige confirmar la contraseña
export const EditarFinancieroFormSchema = CrearFinancieroFormSchema.extend({
  financiero: ActualizarDatoFinancieroSchema.omit({ password_confirmacion: true }),
  password_confirmacion: ActualizarDatoFinancieroSchema.shape.password_confirmacion,
});
