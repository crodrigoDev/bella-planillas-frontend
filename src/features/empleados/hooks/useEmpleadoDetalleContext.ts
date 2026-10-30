import { useOutletContext } from "react-router-dom";

import type { Empleado } from "../types/empleados.types";

/** Lo que el layout de la ficha comparte con las páginas de cada pestaña */
export interface EmpleadoDetalleContext {
  empleado: Empleado;
}

/**
 * Empleado de la ficha abierta, para las páginas de las pestañas
 *
 * @remarks
 * Solo se usa dentro de `EmpleadoDetalleLayout`, que carga al empleado una vez.
 */
export function useEmpleadoDetalleContext(): EmpleadoDetalleContext {
  return useOutletContext<EmpleadoDetalleContext>();
}
