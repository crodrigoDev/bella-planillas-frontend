import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  RegistrarDerechohabienteDto,
  SubirSustentoDerechohabienteDto,
} from "@jyp/shared-contracts";

import { derechohabientesService } from "../services/derechohabientes.service";
import { derechohabientesKey } from "./useDerechohabientes";

/**
 * Registra un derechohabiente, avisa y refresca la lista
 *
 * @remarks
 * Un hijo menor o estudiante activa la asignación familiar del empleado en el
 * backend: también se refresca la consulta del empleado para que la ficha
 * muestre el cambio. La clave `["empleados"]` es la de la feature `empleados`;
 * se repite aquí solo para esto, porque una feature no importa de otra.
 */
export function useRegistrarDerechohabiente(empleadoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Omit<RegistrarDerechohabienteDto, "empleado_id">) =>
      derechohabientesService.registrar(empleadoId, dto),
    onSuccess: () => {
      toast.success("El derechohabiente se registró correctamente.");

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: derechohabientesKey.all }),
        queryClient.invalidateQueries({ queryKey: ["empleados"] }),
      ]);
    },
  });
}

/** Da de baja a un derechohabiente, avisa y refresca la lista */
export function useDesactivarDerechohabiente(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => derechohabientesService.desactivar(id),
    onSuccess: () => {
      toast.success("El derechohabiente se quitó correctamente.");

      return queryClient.invalidateQueries({
        queryKey: derechohabientesKey.all,
      });
    },
  });
}

/** Adjunta un sustento a un derechohabiente, avisa y refresca sus documentos */
export function useSubirSustento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dto,
      file,
    }: {
      dto: SubirSustentoDerechohabienteDto;
      file: File;
    }) => derechohabientesService.subirSustento(dto, file),
    onSuccess: () => {
      toast.success("El sustento se adjuntó correctamente.");

      return queryClient.invalidateQueries({
        queryKey: derechohabientesKey.all,
      });
    },
  });
}
