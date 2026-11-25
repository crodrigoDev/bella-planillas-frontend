import type {
  CongelarPlanillaDto,
  GenerarPlanillasDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";

import { leerErrorBlob } from "@/lib/api/apiError.utils";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiMeta,
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import { extraerNombreArchivo } from "@/lib/archivo.utils";
import type {
  PlanillaDetalle,
  PlanillaResumen,
  PlanillasFilters,
  PlanillasPage,
  SolicitudGeneracion,
  TrabajoPlanillas,
} from "../types/planillas.types";

const BASE_URL = "/nomina/planillas";

/** Mensaje amigable cuando faltan las variables de empresa requeridas para validar */
const MENSAJE_EMPRESA_INCOMPLETA =
  "Faltan los datos de la empresa (razón social, RUC y dirección). Pide al administrador que los registre antes de validar.";

/** Metadatos del listado sin `totalPages`, que se calcula en el cliente */
type ListMeta = ApiMeta & {
  total: number;
  page: number;
  limit: number;
};

/**
 * Agrupa las operaciones de planillas que se comunican al backend
 */
export const planillasService = {
  /**
   * Lista las planillas de un mes de forma paginada
   */
  list: async (filters: PlanillasFilters): Promise<PlanillasPage> => {
    const response = await protectedHttpClient.get<
      Omit<PaginationApiResponse<PlanillaResumen>, "meta"> & { meta: ListMeta }
    >(BASE_URL, { params: filters });

    const { total, page, limit } = response.data.meta;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Obtiene el detalle completo de una planilla por su identificador
   *
   * @returns La planilla, o `null` si no existe o el identificador no es válido
   */
  getById: async (id: string): Promise<PlanillaDetalle | null> => {
    try {
      const response = await protectedHttpClient.get<
        ApiResponse<PlanillaDetalle>
      >(`${BASE_URL}/${id}`);

      return response.data.data;
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === 400 || status === 404) return null;

      throw error;
    }
  },

  /**
   * Solicita la generación de planillas para un período (todos o un colaborador)
   */
  generar: async (dto: GenerarPlanillasDto): Promise<SolicitudGeneracion> => {
    const response = await protectedHttpClient.post<
      ApiResponse<SolicitudGeneracion>
    >(`${BASE_URL}/generar`, dto);

    return response.data.data;
  },

  /**
   * Consulta el estado y avance de una solicitud de cálculo de planillas
   */
  consultarTrabajo: async (trabajoId: string): Promise<TrabajoPlanillas> => {
    const response = await protectedHttpClient.get<
      ApiResponse<TrabajoPlanillas>
    >(`${BASE_URL}/trabajos/${trabajoId}`);

    return response.data.data;
  },

  /**
   * Valida una planilla abierta para dejarla lista para emisión de boleta
   */
  validar: async (
    id: string,
    dto: CongelarPlanillaDto,
  ): Promise<PlanillaDetalle> => {
    try {
      const response = await protectedHttpClient.post<
        ApiResponse<PlanillaDetalle>
      >(`${BASE_URL}/${id}/congelar`, dto);

      return response.data.data;
    } catch (error) {
      if (
        isAxiosError<{ detail?: unknown }>(error) &&
        typeof error.response?.data?.detail === "string" &&
        (error.response.data.detail.includes("EMPRESA_NOMBRE") ||
          error.response.data.detail.includes("EMPRESA_RUC") ||
          error.response.data.detail.includes("EMPRESA_DIRECCION"))
      ) {
        error.response.data.detail = MENSAJE_EMPRESA_INCOMPLETA;
      }

      throw error;
    }
  },

  /**
   * Descarga la boleta de pago en PDF de una planilla validada o declarada
   */
  descargarBoleta: async (
    id: string,
  ): Promise<{ blob: Blob; nombre: string }> => {
    try {
      const response = await protectedHttpClient.get<Blob>(
        `${BASE_URL}/${id}/boleta`,
        { responseType: "blob" },
      );

      const disposition = response.headers["content-disposition"] as
        | string
        | undefined;

      return {
        blob: response.data,
        nombre: extraerNombreArchivo(disposition, "boleta.pdf"),
      };
    } catch (error) {
      await leerErrorBlob(error);
      throw error;
    }
  },
};
