import {
  CrearContratoSchema,
  CrearDatoFinancieroSchema,
  CrearEmpleadoSchema,
} from "@jyp/shared-contracts";

// Esta comprobacion tambien la hace el backend al crear el contrato
const ContratoRegistroSchema = CrearContratoSchema.omit({ empleado_id: true })
  .refine((values) => !values.fecha_fin || values.fecha_inicio <= values.fecha_fin, {
    path: ["fecha_fin"],
    message: "La fecha de fin no puede ser anterior a la fecha de inicio",
  });

// El empleado_id se obtiene al crear al empleado, no se pide en el formulario
export const RegistroEmpleadoSchema = CrearEmpleadoSchema.extend({
  contrato: ContratoRegistroSchema,
  financiero: CrearDatoFinancieroSchema.omit({ empleado_id: true }),
});
