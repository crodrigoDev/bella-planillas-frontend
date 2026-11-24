import type {
  CrearNovedadPlanillaDto,
  ResolverNovedadPlanillaDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type {
  NovedadesFilters,
  NovedadPlanilla,
} from "../types/novedades.types";

const BASE_URL = "/nomina/planillas/novedades";

const MENSAJE_ERROR_MES_VALIDADO =
  "No se pudo guardar el cambio. Si la planilla de este mes ya está validada, sus novedades ya no se pueden modificar; si no lo está, inténtalo de nuevo en unos minutos.";

const MENSAJE_DSO_DUPLICADO =
  "Este colaborador ya tiene un descuento por descanso semanal aprobado en este mes. Anula ese antes de aprobar otro.";

const DETAIL_REGISTRO_DUPLICADO = "Ya existe un registro con estos datos únicos.";

const traducirErrorMesValidado = (error: unknown) => {
  if (!isAxiosError<{ detail?: unknown }>(error) || !error.response) return;

  if (error.response.status === 500) {
    // `getApiErrorMessage` ignora `detail` cuando status >= 500; se ajusta a 422 para mostrar el aviso traducido.
    error.response.status = 422;
    const data =
      typeof error.response.data === "object" && error.response.data !== null
        ? error.response.data
        : {};
    error.response.data = {
      ...data,
      detail: MENSAJE_ERROR_MES_VALIDADO,
    };
  }
};

/**
 * Agrupa las operaciones de novedades de planilla que se comunican al backend
 */
export const novedadesService = {
  /**
   * Lista las novedades de un colaborador en un período
   */
  listar: async ({
    empleadoId,
    periodo,
  }: NovedadesFilters): Promise<NovedadPlanilla[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<NovedadPlanilla[]>
    >(`${BASE_URL}/listar`, {
      params: { empleado_id: empleadoId, periodo },
    });

    return response.data.data;
  },

  /**
   * Registra una nueva novedad en estado pendiente
   */
  registrar: async (dto: CrearNovedadPlanillaDto): Promise<NovedadPlanilla> => {
    try {
      const response = await protectedHttpClient.post<
        ApiResponse<NovedadPlanilla>
      >(BASE_URL, dto);

      return response.data.data;
    } catch (error) {
      traducirErrorMesValidado(error);
      throw error;
    }
  },

  /**
   * Aprueba, rechaza o anula una novedad existente
   */
  resolver: async (
    id: string,
    dto: ResolverNovedadPlanillaDto,
  ): Promise<NovedadPlanilla> => {
    try {
      const response = await protectedHttpClient.post<
        ApiResponse<NovedadPlanilla>
      >(`${BASE_URL}/${id}/resolver`, dto);

      return response.data.data;
    } catch (error) {
      traducirErrorMesValidado(error);

      if (
        isAxiosError<{ detail?: unknown }>(error) &&
        error.response?.status === 409 &&
        typeof error.response.data?.detail === "string" &&
        error.response.data.detail === DETAIL_REGISTRO_DUPLICADO
      ) {
        error.response.data.detail = MENSAJE_DSO_DUPLICADO;
      }

      throw error;
    }
  },
};
