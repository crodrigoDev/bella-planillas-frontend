import type { SolicitarExportacionDto } from "@jyp/shared-contracts";

import { leerErrorBlob } from "@/lib/api/apiError.utils";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import { extraerNombreArchivo } from "@/lib/archivo.utils";
import type {
  Exportacion,
  SolicitudExportacion,
} from "../types/exportaciones.types";

const BASE_URL = "/integraciones";

/**
 * Operaciones de exportaciones de nómina que se comunican con el API
 */
export const exportacionesService = {
  /**
   * Solicita una nueva exportación mensual para un formato y alcance dados
   */
  solicitar: async (
    dto: SolicitarExportacionDto,
  ): Promise<SolicitudExportacion> => {
    const response = await protectedHttpClient.post<
      ApiResponse<SolicitudExportacion>
    >(`${BASE_URL}/exportaciones`, dto);

    return response.data.data;
  },

  /**
   * Consulta el estado, archivos y resultado de una exportación por su identificador
   */
  consultar: async (id: string): Promise<Exportacion> => {
    const response = await protectedHttpClient.get<ApiResponse<Exportacion>>(
      `${BASE_URL}/trabajos/${id}`,
    );

    return response.data.data;
  },

  /**
   * Descarga uno de los archivos generados de una exportación finalizada
   */
  descargarArchivo: async (
    id: string,
    nombre: string,
  ): Promise<{ blob: Blob; nombre: string }> => {
    try {
      const response = await protectedHttpClient.get<Blob>(
        `${BASE_URL}/trabajos/${id}/archivos/${encodeURIComponent(nombre)}`,
        { responseType: "blob" },
      );

      const disposition = response.headers["content-disposition"] as
        | string
        | undefined;

      return {
        blob: response.data,
        nombre: extraerNombreArchivo(disposition, nombre),
      };
    } catch (error) {
      await leerErrorBlob(error);
      throw error;
    }
  },
};
