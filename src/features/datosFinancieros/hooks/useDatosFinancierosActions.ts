import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ActualizarDatoFinancieroDto,
  CrearDatoFinancieroDto,
} from "@jyp/shared-contracts";

import { datosFinancierosService } from "../services/datosFinancieros.service";
import { datosFinancierosKey } from "./useDatosFinancieros";

/** Registra los datos financieros de un empleado, avisa y refresca la ficha */
export function useCrearDatosFinancieros(empleadoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Omit<CrearDatoFinancieroDto, "empleado_id">) =>
      datosFinancierosService.crear(empleadoId, dto),
    onSuccess: () => {
      toast.success("Los datos financieros se registraron correctamente.");

      return queryClient.invalidateQueries({
        queryKey: datosFinancierosKey.all,
      });
    },
  });
}

/**
 * Guarda los cambios de los datos financieros, avisa y refresca la ficha
 *
 * @remarks
 * Si la contraseña es incorrecta el backend responde 401 con el motivo; el
 * error llega a quien usa la mutación.
 */
export function useEditarDatosFinancieros(empleadoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ActualizarDatoFinancieroDto) =>
      datosFinancierosService.editar(empleadoId, dto),
    onSuccess: () => {
      toast.success("Los datos financieros se actualizaron correctamente.");

      return queryClient.invalidateQueries({
        queryKey: datosFinancierosKey.all,
      });
    },
  });
}
