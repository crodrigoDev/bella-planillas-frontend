import type { ParseParams, ZodErrorMap } from "zod/v3";

/**
 * Traduce al español los mensajes por defecto de los esquemas de shared contracts
 *
 * @remarks
 * Los esquemas del contrato usan zod 3 y solo traducen algunos mensajes.
 * Esta función cubre el resto (campos vacíos, textos muy largos, etc.) y
 * deja intactos los mensajes que el contrato ya escribió en español.
 * Se usa a través de `zodResolverOptions`.
 */
export const zodEsErrorMap: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case "invalid_type":
      // Un campo numérico vacío o con texto llega como NaN
      if (issue.expected === "number") return { message: "Ingresa un número válido" };

      if (issue.received === "undefined" || issue.received === "null")
        return { message: "Este campo es obligatorio" };

      return { message: "El valor no es válido" };

    case "too_small":
      if (issue.type === "string")
        return {
          message:
            issue.minimum === 1
              ? "Este campo es obligatorio"
              : `Debe tener al menos ${issue.minimum} caracteres`,
        };

      return { message: ctx.defaultError };

    case "too_big":
      if (issue.type === "string")
        return { message: `No puede superar los ${issue.maximum} caracteres` };

      return { message: ctx.defaultError };

    case "invalid_enum_value":
      return { message: "Selecciona una opción" };

    default:
      return { message: ctx.defaultError };
  }
};

/**
 * Opciones para `zodResolver` con un esquema de shared contracts (zod 3)
 *
 * @example
 * zodResolver(CrearEmpleadoSchema, zodResolverOptions)
 *
 * @remarks
 * Zod 3 exige todos los campos de `ParseParams`; `path` y `async` quedan con
 * sus valores normales y el resolver ajusta lo que necesite.
 */
export const zodResolverOptions: ParseParams = {
  errorMap: zodEsErrorMap,
  path: [],
  async: false,
};
