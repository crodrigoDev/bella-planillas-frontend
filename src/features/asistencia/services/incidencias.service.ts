import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  AprobarMesResultado,
  CierreLote,
  ConteoIncidencias,
  GenerarCierreLoteDto,
  Incidencia,
  IncidenciaFilters,
  IncidenciasPage,
} from "../types/incidencias.types";

/**
 * Agrupa las operaciones del cierre mensual (todos los colaboradores) que se comunican al backend
 */
export const incidenciasService = {
  /**
   * Consulta una página de resúmenes mensuales aplicando los filtros indicados
   *
   * @returns Los resúmenes de la página y su paginación
   */
  list: async (filters: IncidenciaFilters): Promise<IncidenciasPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<Incidencia>
    >("/asistencia/incidencias", { params: filters });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Cuenta los resúmenes del mes en cada estado
   *
   * @returns Cuántos hay pendientes, aprobados y rechazados
   */
  contar: async (
    periodo: string,
    areaId?: string,
  ): Promise<ConteoIncidencias> => {
    const response = await protectedHttpClient.get<
      ApiResponse<ConteoIncidencias>
    >("/asistencia/incidencias/totales", {
      params: { periodo, area_id: areaId },
    });

    return response.data.data;
  },

  /**
   * Calcula el resumen de un lote de colaboradores del mes
   *
   * @remarks
   * Un error de un colaborador no corta el lote: viene en `detalle`. El backend
   * responde 404 si no hay colaboradores con vínculo en el mes y 400 si el mes es futuro.
   */
  generarLote: async (dto: GenerarCierreLoteDto): Promise<CierreLote> => {
    const response = await protectedHttpClient.post<ApiResponse<CierreLote>>(
      "/asistencia/incidencias/generar-cierre",
      dto,
    );

    return response.data.data;
  },

  /**
   * Aprueba todos los resúmenes pendientes del mes, de todas las áreas
   *
   * @throws Un 409 si alguno no está vigente, completo o tiene días por resolver (no se aprueba ninguno),
   * y un 400 si hay más de 100 pendientes
   */
  aprobarMes: async (periodo: string): Promise<AprobarMesResultado> => {
    const response = await protectedHttpClient.patch<
      ApiResponse<AprobarMesResultado>
    >("/asistencia/incidencias/aprobar", { periodo });

    return response.data.data;
  },
};
