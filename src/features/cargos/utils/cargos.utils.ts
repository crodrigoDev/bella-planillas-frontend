import type { ActualizarCargoDto, CrearCargoDto } from "@jyp/shared-contracts";

import { formatCurrency } from "@/lib/format.utils";
import type { CargoFormDatos } from "../schemas/cargo.schema";

interface ToCargoDto {
  (values: CargoFormDatos, esEdicion: true): ActualizarCargoDto;
  (values: CargoFormDatos, esEdicion?: false): CrearCargoDto;
}

/**
 * Convierte los datos validados del formulario de cargo al cuerpo que espera la petición
 *
 * @remarks
 * Al editar, los campos opcionales vacíos (descripción y sueldo máximo) se envían
 * como `null` para limpiarlos en lugar de conservar el valor anterior.
 */
export const toCargoDto: ToCargoDto = (
  values: CargoFormDatos,
  esEdicion = false,
) => {
  const vacio = esEdicion ? null : undefined;
  const maxText = values.sueldo_maximo.trim();

  return {
    id_area: values.id_area,
    nombre: values.nombre,
    descripcion: values.descripcion || vacio,
    sueldo_minimo: Number(values.sueldo_minimo),
    sueldo_maximo: maxText ? Number(maxText) : vacio,
  };
};

/**
 * Muestra la banda salarial del cargo en soles
 *
 * @remarks
 * Los montos llegan como texto decimal, por eso se convierten con `Number()`.
 */
export const formatBandaSalarial = (
  sueldoMinimo: string | null,
  sueldoMaximo: string | null,
): string => {
  const tieneMinimo = sueldoMinimo !== null && sueldoMinimo !== "";
  const tieneMaximo = sueldoMaximo !== null && sueldoMaximo !== "";

  if (tieneMinimo && tieneMaximo)
    return `${formatCurrency(Number(sueldoMinimo))} – ${formatCurrency(Number(sueldoMaximo))}`;

  if (tieneMinimo) return `Desde ${formatCurrency(Number(sueldoMinimo))}`;

  if (tieneMaximo) return `Hasta ${formatCurrency(Number(sueldoMaximo))}`;

  return "—";
};
