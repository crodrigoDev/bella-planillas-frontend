import type { core } from "zod";

/**
 * Traduce al español los mensajes por defecto de los esquemas de zod 4
 *
 * @remarks
 * Cubre los errores genéricos (campos vacíos, textos largos o cortos, números
 * fuera de rango, formatos inválidos y opciones sin elegir) y devuelve
 * `undefined` para el resto; los mensajes ya escritos en el esquema mantienen
 * prioridad. Se usa a través de `zodResolverOptions`.
 */
export const zodEsErrorMap = (issue: core.$ZodRawIssue): string | undefined => {
  switch (issue.code) {
    case "invalid_type":
      // Un campo numérico vacío o con texto llega como NaN
      if (issue.expected === "number") return "Ingresa un número válido";

      if (issue.input === undefined || issue.input === null)
        return "Este campo es obligatorio";

      return "El valor no es válido";

    case "too_small":
      if (issue.origin === "string")
        return issue.minimum === 1
          ? "Este campo es obligatorio"
          : `Debe tener al menos ${issue.minimum} caracteres`;

      if (issue.origin === "array") return "Selecciona al menos una opción";

      if (issue.origin === "number")
        return issue.inclusive
          ? `Debe ser como mínimo ${issue.minimum}`
          : `Debe ser mayor que ${issue.minimum}`;

      return undefined;

    case "too_big":
      if (issue.origin === "string")
        return `No puede superar los ${issue.maximum} caracteres`;

      if (issue.origin === "number")
        return `Debe ser como máximo ${issue.maximum}`;

      return undefined;

    case "invalid_value":
      return "Selecciona una opción";

    case "invalid_format":
      if (issue.format === "uuid") return "Selecciona una opción válida";
      if (issue.format === "email") return "Ingresa un correo válido";
      if (issue.format === "date" || issue.format === "datetime")
        return "Ingresa una fecha válida";

      return "El formato no es válido";

    default:
      return undefined;
  }
};

/**
 * Opciones para `zodResolver` con esquemas de zod 4 (propios y de shared contracts)
 *
 * @example
 * zodResolver(CrearEmpleadoSchema, zodResolverOptions)
 */
export const zodResolverOptions: core.ParseContext<core.$ZodIssue> = {
  error: zodEsErrorMap,
};
