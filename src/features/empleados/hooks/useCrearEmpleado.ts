import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ROUTE_PATHS } from "@/app/routes/path";
import { contratosService } from "@/features/contratos/services/contratos.service";
import { datosFinancierosService } from "@/features/datosFinancieros/services/datosFinancieros.service";
import { derechohabientesService } from "@/features/derechohabientes/services/derechohabientes.service";
import { nuevoEmpleadoService } from "../services/nuevoEmpleado.service";
import { useNuevoEmpleadoStore } from "../store/nuevoEmpleado.store";
import { empleadosKey } from "./useEmpleados";

/**
 * Envía el registro completo al backend: empleado, datos financieros,
 * contrato y derechohabientes, en ese orden
 *
 * @remarks
 * Son varias llamadas y la primera crea el empleado, así que una falla a la
 * mitad deja un empleado a medio registrar. Cada parte que se guarda queda
 * anotada en el `progreso` del borrador: al reintentar solo se envía lo que
 * falta. Al terminar se descarta el borrador y se vuelve al listado.
 */
export function useCrearEmpleado() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // Se lee el store en cada paso para ver el progreso más reciente
      const getState = useNuevoEmpleadoStore.getState;
      const { datos, datosFinancieros, contrato } = getState();

      if (!datos || !datosFinancieros || !contrato)
        throw new Error("Completa los pasos obligatorios antes de confirmar.");

      // La fecha de filiación a la AFP se guarda en el empleado, no en los datos financieros
      const { afp_fecha_filiacion, ...financieros } = datosFinancieros;

      let empleadoId = getState().progreso.empleadoId;

      if (!empleadoId) {
        empleadoId = await nuevoEmpleadoService.crearEmpleado({
          ...datos,
          afp_fecha_filiacion,
        });
        getState().updateProgreso({ empleadoId });
      }

      if (!getState().progreso.financierosListos) {
        await datosFinancierosService.crear(
          empleadoId,
          financieros,
        );
        getState().updateProgreso({ financierosListos: true });
      }

      if (!getState().progreso.contratoListo) {
        await contratosService.crear(empleadoId, contrato);
        getState().updateProgreso({ contratoListo: true });
      }

      const { derechohabientes } = getState();

      for (
        let index = getState().progreso.derechohabientesListos;
        index < derechohabientes.length;
        index++
      ) {
        await derechohabientesService.registrar(
          empleadoId,
          derechohabientes[index],
        );
        getState().updateProgreso({ derechohabientesListos: index + 1 });
      }
    },
    onSuccess: async () => {
      toast.success("El empleado se registró correctamente.");

      // El borrador se descarta antes de navegar: ya está todo guardado
      useNuevoEmpleadoStore.getState().reset();
      await queryClient.invalidateQueries({ queryKey: empleadosKey.all });
      navigate(ROUTE_PATHS.gestionPersonal.empleados);
    },
  });
}
