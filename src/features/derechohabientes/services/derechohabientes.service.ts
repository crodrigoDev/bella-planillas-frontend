import type {
  RegistrarDerechohabienteDto,
  SubirSustentoDerechohabienteDto,
} from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protected-http-client";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type {
  Derechohabiente,
  DerechohabienteConSustentos,
} from "../types/derechohabientes.types";

/**
 * Agrupa las operaciones de derechohabientes que se comunican al backend
 */
export const derechohabientesService = {
  /** Lista los derechohabientes activos de un empleado */
  listByEmpleado: async (empleadoId: string): Promise<Derechohabiente[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<Derechohabiente[]>
    >(`/rrhh/derechohabientes/empleado/${empleadoId}`);

    return response.data.data;
  },

  /** Obtiene un derechohabiente con sus documentos de sustento */
  getById: async (id: string): Promise<DerechohabienteConSustentos> => {
    const response = await protectedHttpClient.get<
      ApiResponse<DerechohabienteConSustentos>
    >(`/rrhh/derechohabientes/${id}`);

    return response.data.data;
  },

  /**
   * Registra un derechohabiente de un empleado
   *
   * @remarks
   * Si es un hijo menor o estudiante, el backend activa solo la asignación
   * familiar del empleado.
   */
  registrar: async (
    empleadoId: string,
    derechohabiente: Omit<RegistrarDerechohabienteDto, "empleado_id">,
  ): Promise<void> => {
    const dto: RegistrarDerechohabienteDto = {
      ...derechohabiente,
      empleado_id: empleadoId,
    };

    await protectedHttpClient.post("/rrhh/derechohabientes/registrar", dto);
  },

  /** Da de baja a un derechohabiente; deja de aparecer en el listado */
  desactivar: async (id: string): Promise<void> => {
    await protectedHttpClient.delete(`/rrhh/derechohabientes/${id}/desactivar`);
  },

  /**
   * Adjunta un documento de sustento a un derechohabiente
   *
   * @remarks
   * Los campos de texto van antes que el archivo: el backend los lee cuando
   * recibe el archivo, y los que llegan después no los ve.
   */
  subirSustento: async (
    dto: SubirSustentoDerechohabienteDto,
    file: File,
  ): Promise<void> => {
    const body = new FormData();

    body.append("derechohabiente_id", dto.derechohabiente_id);
    body.append("tipo_documento", dto.tipo_documento);
    if (dto.fecha_emision) body.append("fecha_emision", dto.fecha_emision);
    if (dto.fecha_vencimiento)
      body.append("fecha_vencimiento", dto.fecha_vencimiento);
    body.append("file", file);

    await protectedHttpClient.post(
      "/rrhh/derechohabientes/sustento/abrir",
      body,
    );
  },
};
