import type {
  AsignarJornadaAsistenciaDto,
  ResolverDiaAsistenciaDto,
  ResolverIncidenciaDto,
} from "@jyp/shared-contracts";
import { isAxiosError } from "axios";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type { ResumenMes, TipoMarca } from "../types/asistencia.types";

/** Marcación manual tal como se envía: la fecha y hora ya llevan la zona de Lima */
export interface MarcacionManualDto {
  nro_documento: string;
  fecha_hora: string;
  tipo_marcacion: TipoMarca;
  motivo: string;
}

/**
 * Agrupa las operaciones de asistencia de un empleado que se comunican al backend
 */
export const asistenciaService = {
  /**
   * Obtiene el resumen de un mes de un empleado, con el detalle día por día
   *
   * @returns El resumen, o null si todavía no se generó (el backend responde 404)
   */
  getResumen: async (
    empleadoId: string,
    periodo: string,
  ): Promise<ResumenMes | null> => {
    try {
      const response = await protectedHttpClient.get<ApiResponse<ResumenMes>>(
        "/asistencia/detalle-diario",
        { params: { empleado_id: empleadoId, periodo } },
      );

      return response.data.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /** Calcula (o vuelve a calcular) el resumen de un mes de un empleado */
  generar: async (empleadoId: string, periodo: string): Promise<void> => {
    await protectedHttpClient.post("/asistencia/incidencias/generar-cierre", {
      periodo,
      empleado_id: empleadoId,
    });
  },

  /** Aprueba el resumen de un mes de un empleado */
  aprobar: async (empleadoId: string, periodo: string): Promise<void> => {
    await protectedHttpClient.patch("/asistencia/incidencias/aprobar", {
      periodo,
      empleado_id: empleadoId,
    });
  },

  /** Rechaza o reabre el resumen de un mes, con el motivo */
  resolverResumen: async (dto: ResolverIncidenciaDto): Promise<void> => {
    await protectedHttpClient.post("/asistencia/incidencias/resolver", dto);
  },

  /** Registra una marcación a mano */
  marcar: async (dto: MarcacionManualDto): Promise<void> => {
    await protectedHttpClient.post("/asistencia/marcacion/web", dto);
  },

  /** Resuelve un día: la ausencia, las marcaciones o el sobretiempo */
  resolverDia: async (dto: ResolverDiaAsistenciaDto): Promise<void> => {
    await protectedHttpClient.post("/asistencia/decisiones", dto);
  },

  /** Asigna una jornada a un empleado desde una fecha */
  asignarJornada: async (dto: AsignarJornadaAsistenciaDto): Promise<void> => {
    await protectedHttpClient.post("/asistencia/jornadas/asignar", dto);
  },
};
