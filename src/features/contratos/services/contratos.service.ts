import type { CrearContratoDto } from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { PaginationApiResponse } from "@/lib/api/types/api.types";
import type { Contrato } from "../types/contratos.types";

/** Datos con los que se crea un contrato de alta (sin renovación) */
export type NuevoContrato = Omit<
  CrearContratoDto,
  "empleado_id" | "estado" | "contrato_origen_id"
>;

/**
 * Agrupa las operaciones de contratos que se comunican al backend
 */
export const contratosService = {
  /**
   * Lista los contratos de un empleado, del más reciente al más antiguo
   *
   * @remarks
   * Pide hasta 100: un empleado no llega a tener tantos contratos.
   */
  listByEmpleado: async (empleadoId: string): Promise<Contrato[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<Contrato>
    >(`/rrhh/contrato/empleado/${empleadoId}`, { params: { limit: 100 } });

    return response.data.data;
  },

  /** Crea el contrato de un empleado */
  crear: async (empleadoId: string, contrato: NuevoContrato): Promise<void> => {
    await protectedHttpClient.post("/rrhh/contrato", {
      ...contrato,
      empleado_id: empleadoId,
    });
  },
};
