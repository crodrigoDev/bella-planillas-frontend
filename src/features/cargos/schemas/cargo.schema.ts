import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { z } from "zod/v3";

import { zodResolverOptions } from "@/lib/zodMessages.utils";

const REGEX_NUMERO = /^-?\d+(\.\d+)?$/;
const REGEX_MONTO = /^\d+(\.\d{1,2})?$/;
const MAX_SUELDO = 99_999_999.99;

/** Remuneración mínima vital usada como valor inicial al crear un cargo */
export const SUELDO_MINIMO_DEFECTO = "1130";

/**
 * Esquema del formulario para crear o editar un cargo
 *
 * @remarks
 * Los sueldos se validan como texto antes de pasarlos a número: usar
 * `z.coerce.number()` sobre un campo vacío lo convierte en `0` y hace fallar
 * la comparación de sueldo máximo ≥ mínimo cuando el máximo se deja vacío.
 */
export const CargoFormSchema = z
  .object({
    id_area: z.string().uuid("Elige un área"),
    nombre: z
      .string()
      .trim()
      .min(1, "Ingresa el nombre del cargo")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede superar los 100 caracteres"),
    descripcion: z
      .string()
      .trim()
      .max(255, "La descripción no puede superar los 255 caracteres"),
    sueldo_minimo: z.string(),
    sueldo_maximo: z.string(),
  })
  .superRefine((values, ctx) => {
    const error = (path: "sueldo_minimo" | "sueldo_maximo", message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    const minText = values.sueldo_minimo.trim();
    let minimoValido: number | null = null;

    if (minText === "") {
      error("sueldo_minimo", "Ingresa el sueldo mínimo");
    } else if (!REGEX_NUMERO.test(minText)) {
      error("sueldo_minimo", "Ingresa un monto válido");
    } else if (Number(minText) < 0) {
      error("sueldo_minimo", "El sueldo mínimo no puede ser negativo");
    } else if (!REGEX_MONTO.test(minText)) {
      error("sueldo_minimo", "Ingresa como máximo 2 decimales");
    } else if (Number(minText) > MAX_SUELDO) {
      error("sueldo_minimo", "El monto no puede superar S/ 99,999,999.99");
    } else {
      minimoValido = Number(minText);
    }

    const maxText = values.sueldo_maximo.trim();

    if (maxText !== "") {
      if (!REGEX_NUMERO.test(maxText)) {
        error("sueldo_maximo", "Ingresa un monto válido");
      } else if (Number(maxText) < 0) {
        error("sueldo_maximo", "El sueldo máximo no puede ser negativo");
      } else if (!REGEX_MONTO.test(maxText)) {
        error("sueldo_maximo", "Ingresa como máximo 2 decimales");
      } else if (Number(maxText) > MAX_SUELDO) {
        error("sueldo_maximo", "El monto no puede superar S/ 99,999,999.99");
      } else if (minimoValido !== null && Number(maxText) < minimoValido) {
        error(
          "sueldo_maximo",
          "El sueldo máximo debe ser mayor o igual al sueldo mínimo",
        );
      }
    }
  });

const baseResolver = zodResolver(CargoFormSchema, zodResolverOptions);

/** Valores del formulario de cargo antes de validar */
export type CargoFormValues = Parameters<typeof baseResolver>[0];

/** Datos validados del formulario de cargo, listos para convertir al DTO */
export type CargoFormDatos =
  typeof baseResolver extends Resolver<CargoFormValues, unknown, infer Datos>
    ? Datos
    : never;

/** Resolver del formulario de cargo */
export const cargoResolver = baseResolver;
