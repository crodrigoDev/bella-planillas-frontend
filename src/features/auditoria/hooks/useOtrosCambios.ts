import { useQuery } from "@tanstack/react-query";

import { auditoriaService } from "../services/auditoria.service";
import type { AfectadoActividad } from "../types/auditoria.types";

/** Cuántos cambios se muestran en el bloque "Otros cambios" */
const MAX_OTROS_CAMBIOS = 5;

/**
 * Obtiene los últimos cambios del mismo afectado, sin contar el que se está viendo
 *
 * @param afectado - A quién afectó el cambio; sin afectado o sin id (la empresa) no se consulta
 * @param actividadId - Fila actual, que se quita de la lista
 *
 * @remarks
 * Pide uno más de los que muestra, por si la fila actual está entre los más recientes.
 */
export function useOtrosCambios(
  afectado: AfectadoActividad | null,
  actividadId: string,
) {
  const tipo = afectado?.tipo;
  const id = afectado?.id;

  return useQuery({
    queryKey: ["auditoria", "otros-cambios", tipo, id] as const,
    queryFn: () =>
      auditoriaService.listAfectado(
        tipo as Exclude<typeof tipo, "empresa" | undefined>,
        id as string,
        { page: 1, limit: MAX_OTROS_CAMBIOS + 1 },
      ),
    enabled: Boolean(id) && tipo !== "empresa",
    select: (pagina) =>
      pagina.items
        .filter((fila) => fila.id !== actividadId)
        .slice(0, MAX_OTROS_CAMBIOS),
  });
}
