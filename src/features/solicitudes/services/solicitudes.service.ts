import type { EvaluarSolicitudDto } from "@jyp/shared-contracts";
import { isAxiosError } from "axios";

import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiMeta,
  ApiResponse,
  PaginationApiResponse,
  PaginationMeta,
} from "@/lib/api/types/api.types";
import type {
  EventoSolicitud,
  NuevaSolicitudDto,
  Solicitud,
  SolicitudCreada,
  SolicitudDetalle,
  SolicitudFilters,
  SolicitudesPage,
  SolicitudesPorEstado,
} from "../types/solicitudes.types";

const BASE_URL = "/rrhh/solicitudes";

/** Metadatos del listado: además de la paginación trae los conteos por estado */
type ListMeta = ApiMeta &
  PaginationMeta & {
    total_sin_estado: number;
    por_estado: SolicitudesPorEstado;
  };

/** Responsable del detalle: el backend lo devuelve con el usuario y su empleado */
interface ResponsableCrudo {
  id: string;
  empleados: { nombre: string; apellido: string };
}

type DetalleCrudo = Omit<SolicitudDetalle, "responsable"> & {
  responsable: ResponsableCrudo | null;
};

/**
 * Arma el cuerpo multipart de una solicitud con sustento
 *
 * @remarks
 * Los campos de texto van antes que el archivo, que va en el campo `archivo`.
 * Los campos vacíos no se envían: el backend no trata como opcionales a
 * `hora_inicio` y `hora_fin` vacíos.
 */
const buildMultipartBody = (dto: NuevaSolicitudDto, archivo: File): FormData => {
  const body = new FormData();

  Object.entries(dto).forEach(([campo, valor]) => {
    if (valor === undefined || valor === null || valor === "") return;

    body.append(campo, String(valor));
  });
  body.append("archivo", archivo);

  return body;
};

/**
 * Agrupa las operaciones de solicitudes que se comunican al backend
 */
export const solicitudesService = {
  /**
   * Consulta una página de solicitudes aplicando los filtros indicados
   *
   * @remarks
   * Los conteos por estado ignoran el filtro de estado, para que cada pestaña
   * muestre cuántas solicitudes tendría.
   */
  list: async (filters: SolicitudFilters): Promise<SolicitudesPage> => {
    const { search, ...rest } = filters;

    const response = await protectedHttpClient.get<
      Omit<PaginationApiResponse<Solicitud>, "meta"> & { meta: ListMeta }
    >(BASE_URL, { params: { ...rest, search: search || undefined } });

    const { total, page, limit, totalPages, total_sin_estado, por_estado } =
      response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
      totalSinEstado: total_sin_estado,
      porEstado: por_estado,
    };
  },

  /**
   * Busca una solicitud por su id o su código (`SOL-2026-001`)
   *
   * @returns La solicitud, o null si no existe
   */
  getById: async (idOCodigo: string): Promise<SolicitudDetalle | null> => {
    try {
      const response = await protectedHttpClient.get<ApiResponse<DetalleCrudo>>(
        `${BASE_URL}/${idOCodigo}`,
      );
      const { responsable, ...detalle } = response.data.data;

      return {
        ...detalle,
        responsable: responsable
          ? {
              id: responsable.id,
              nombre_completo:
                `${responsable.empleados.nombre} ${responsable.empleados.apellido}`.trim(),
            }
          : null,
      };
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null;

      throw error;
    }
  },

  /** Trae el historial de una solicitud, del evento más antiguo al más reciente */
  getHistorial: async (idOCodigo: string): Promise<EventoSolicitud[]> => {
    const response = await protectedHttpClient.get<
      ApiResponse<EventoSolicitud[]>
    >(`${BASE_URL}/${idOCodigo}/historial`);

    return response.data.data;
  },

  /**
   * Registra una solicitud; con sustento se envía como multipart
   *
   * @throws Un 404 si el colaborador no existe o está inactivo, y un 400 si no cumple las reglas del tipo
   */
  crear: async (
    dto: NuevaSolicitudDto,
    archivo?: File | null,
  ): Promise<SolicitudCreada> => {
    const response = await protectedHttpClient.post<
      ApiResponse<SolicitudCreada>
    >(BASE_URL, archivo ? buildMultipartBody(dto, archivo) : dto);

    const { id, codigo } = response.data.data;

    return { id, codigo };
  },

  /**
   * Toma la solicitud para revisarla: pasa a EN_REVISION con el usuario como responsable
   *
   * @throws Un 409 si ya la tomó otro usuario o ya terminó
   */
  tomar: async (id: string): Promise<void> => {
    await protectedHttpClient.patch(`${BASE_URL}/${id}/asignar-revision`);
  },

  /**
   * Aprueba o rechaza una solicitud en revisión
   *
   * @throws Un 403 si el usuario no es el responsable, y un 409 si un mes del rango ya tiene la asistencia aprobada
   */
  evaluar: async (id: string, dto: EvaluarSolicitudDto): Promise<void> => {
    await protectedHttpClient.patch(`${BASE_URL}/${id}/evaluar`, dto);
  },

  /** Anula una solicitud pendiente o en revisión */
  anular: async (id: string, motivo: string): Promise<void> => {
    await protectedHttpClient.patch(`${BASE_URL}/${id}/anular`, { motivo });
  },
};
