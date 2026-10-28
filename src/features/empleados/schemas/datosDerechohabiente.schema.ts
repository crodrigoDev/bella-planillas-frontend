import { RegistrarDerechohabienteSchema } from "@jyp/shared-contracts";
import { getAge } from "@/lib/date.utils";

/**
 * Edades que acepta cada vínculo, como las valida el backend
 *
 * @remarks
 * El backend repite esta regla al registrar el derechohabiente. Se valida
 * también aquí para avisar en el formulario y no recién al confirmar el
 * registro, cuando el empleado ya se creó.
 */
const EDAD_POR_VINCULO: Record<string, { min?: number; max?: number; mensaje: string }> = {
  HIJO_MENOR: {
    max: 17,
    mensaje: "Un hijo menor de edad debe tener menos de 18 años",
  },
  HIJO_MAYOR_ESTUDIANTE: {
    min: 18,
    max: 28,
    mensaje: "Un hijo mayor estudiante debe tener entre 18 y 28 años",
  },
  HIJO_MAYOR_INCAPACITADO: {
    min: 18,
    mensaje: "Un hijo mayor incapacitado debe tener 18 años o más",
  },
};

/**
 * Esquema de un derechohabiente del paso 4 del registro de un empleado
 *
 * @remarks
 * Parte del esquema del contrato, que es el que valida el backend. Se quita
 * el `empleado_id` porque el empleado aún no existe, y se agrega la regla de
 * edad según el vínculo.
 */
export const DatosDerechohabienteSchema = RegistrarDerechohabienteSchema.omit({
  empleado_id: true,
}).superRefine((datos, ctx) => {
  const edad = getAge(datos.fecha_nacimiento);

  if (edad < 0) {
    ctx.addIssue({
      code: "custom",
      path: ["fecha_nacimiento"],
      message: "La fecha de nacimiento no puede ser futura",
    });
    return;
  }

  const regla = EDAD_POR_VINCULO[datos.vinculo];

  if (!regla) return;

  if (edad < (regla.min ?? 0) || edad > (regla.max ?? Infinity))
    ctx.addIssue({
      code: "custom",
      path: ["fecha_nacimiento"],
      message: `${regla.mensaje} (edad: ${edad} años)`,
    });
});

/** Derechohabiente del paso 4 ya validado */
export type DerechohabienteDraft = typeof DatosDerechohabienteSchema._output;
