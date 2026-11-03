import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ActualizarDatoFinancieroDto,
  CrearDatoFinancieroDto,
} from "@jyp/shared-contracts";

import { datosFinancierosService } from "../services/datosFinancieros.service";
import { datosFinancierosKey } from "./useDatosFinancieros";

/** Datos que se envían y, antes, el guardado de la fecha de filiación si cambió */
interface Guardado<T> {
  dto: T;
  /** Guarda en el empleado la fecha de filiación a la AFP; el backend la exige antes */
  guardarFiliacion?: () => Promise<void>;
}

/** Registra los datos financieros de un empleado, avisa y refresca la ficha */
export function useCrearDatosFinancieros(empleadoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dto,
      guardarFiliacion,
    }: Guardado<Omit<CrearDatoFinancieroDto, "empleado_id">>) => {
      await guardarFiliacion?.();
      await datosFinancierosService.crear(empleadoId, dto);
    },
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
    mutationFn: async ({
      dto,
      guardarFiliacion,
    }: Guardado<ActualizarDatoFinancieroDto>) => {
      await guardarFiliacion?.();
      await datosFinancierosService.editar(empleadoId, dto);
    },
    onSuccess: () => {
      toast.success("Los datos financieros se actualizaron correctamente.");

      return queryClient.invalidateQueries({
        queryKey: datosFinancierosKey.all,
      });
    },
  });
}
