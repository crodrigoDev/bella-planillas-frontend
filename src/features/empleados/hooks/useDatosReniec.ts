import { useMutation } from "@tanstack/react-query";

import { reniecService } from "../services/reniec.service";

/**
 * Consulta nombres y apellidos en RENIEC a partir de un número de DNI
 */
export function useDatosReniec() {
  return useMutation({
    mutationFn: (dni: string) => reniecService.consultarDni(dni),
  });
}
