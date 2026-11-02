import type {
  CrearContratoDto,
  EditarContratoDto,
  RenovarContratoDto,
} from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type { Contrato, ContratoDetalle } from "../types/contratos.types";
import { getNombreArchivo } from "../utils/contratos.utils";

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
   * Pide hasta 100: un empleado no llega a tener tantos contratos. El
   * backend no incluye los contratos anulados.
   */
  listByEmpleado: async (empleadoId: string): Promise<Contrato[]> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<Contrato>
    >(`/rrhh/contrato/empleado/${empleadoId}`, { params: { limit: 100 } });

    return response.data.data;
  },

  /** Obtiene un contrato por id; es el único que trae la `url` del PDF */
  getById: async (id: string): Promise<ContratoDetalle> => {
    const response = await protectedHttpClient.get<ApiResponse<ContratoDetalle>>(
      `/rrhh/contrato/${id}`,
    );

    return response.data.data;
  },

  /** Crea el contrato de un empleado */
  crear: async (empleadoId: string, contrato: NuevoContrato): Promise<void> => {
    await protectedHttpClient.post("/rrhh/contrato", {
      ...contrato,
      empleado_id: empleadoId,
    });
  },

  /** Edita un contrato que todavía no tiene PDF */
  editar: async (id: string, dto: EditarContratoDto): Promise<void> => {
    await protectedHttpClient.put(`/rrhh/contrato/${id}`, dto);
  },

  /** Renueva un contrato: el actual pasa a Renovado y se crea uno nuevo */
  renovar: async (id: string, dto: RenovarContratoDto): Promise<void> => {
    await protectedHttpClient.post(`/rrhh/contrato/${id}/renovar`, dto);
  },

  /** Anula un contrato; deja de aparecer en el listado */
  anular: async (id: string): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/contrato/${id}/anular`);
  },

  /** Adjunta el PDF firmado; después el contrato ya no se puede editar */
  subirPdf: async (id: string, file: File): Promise<void> => {
    const body = new FormData();
    body.append("file", file);

    await protectedHttpClient.post(`/rrhh/contrato/${id}/subir-pdf`, body);
  },

  /**
   * Descarga el PDF de un contrato
   *
   * @returns El PDF como blob, para mostrarlo con una URL temporal
   *
   * @remarks
   * El listado no trae la ruta del archivo, por eso primero se pide el detalle.
   * Va por axios y no por un enlace porque la descarga necesita el token.
   */
  descargarPdf: async (id: string): Promise<Blob> => {
    const { url } = await contratosService.getById(id);

    if (!url) throw new Error("El contrato no tiene PDF adjunto.");

    const response = await protectedHttpClient.get<Blob>(
      `/rrhh/contrato/descargar/${getNombreArchivo(url)}`,
      { responseType: "blob" },
    );

    return response.data;
  },
};
