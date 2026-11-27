import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { ROOT_KEYS } from "@/lib/queryKeys.config";
import { nuevoEmpleadoService } from "../services/nuevoEmpleado.service";

const DISPONIBLE_DEBOUNCE_MS = 400;
const MIN_DOCUMENTO_LENGTH = 8;

/**
 * Consulta si un número de documento ya pertenece a un colaborador registrado
 *
 * @param nroDocumento - Número de documento escrito en el formulario
 * @param enabled - Permite desactivar la consulta (por ejemplo al editar)
 */
export function useDocumentoDisponible(
  nroDocumento: string | undefined,
  enabled = true,
) {
  const limpio = (nroDocumento ?? "").trim();
  const [nroConsultado, setNroConsultado] = useState(
    limpio.length >= MIN_DOCUMENTO_LENGTH ? limpio : "",
  );

  const { run: programarConsulta, cancel } = useDebouncedCallback(
    (valor: string) => setNroConsultado(valor),
    DISPONIBLE_DEBOUNCE_MS,
  );

  useEffect(() => {
    if (!enabled || limpio.length < MIN_DOCUMENTO_LENGTH) {
      cancel();
      return;
    }

    programarConsulta(limpio);
  }, [enabled, limpio, programarConsulta, cancel]);

  const puedeConsultar =
    enabled &&
    limpio.length >= MIN_DOCUMENTO_LENGTH &&
    nroConsultado === limpio;

  const query = useQuery({
    queryKey: [...ROOT_KEYS.empleados, "documento-disponible", nroConsultado],
    queryFn: () =>
      nuevoEmpleadoService.verificarDocumentoDisponible(nroConsultado),
    enabled: puedeConsultar,
    retry: false,
  });

  // No exponer resultados de un número anterior mientras se edita o si tiene menos de 8 dígitos
  return {
    ...query,
    data: puedeConsultar ? query.data : undefined,
  };
}
