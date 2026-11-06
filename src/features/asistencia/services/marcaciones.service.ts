import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type {
  ApiResponse,
  PaginationApiResponse,
} from "@/lib/api/types/api.types";
import type {
  ImportacionMarcacionesResultado,
  ImportacionMarcacionesValidacion,
  Marcacion,
  MarcacionFilters,
  MarcacionesPage,
} from "../types/marcaciones.types";

/** Arma el cuerpo multipart con el Excel; el campo se llama `archivo` */
const buildArchivoBody = (file: File): FormData => {
  const body = new FormData();
  body.append("archivo", file);

  return body;
};

/**
 * Agrupa las operaciones de las marcaciones globales que se comunican al backend
 */
export const marcacionesService = {
  /**
   * Consulta una página de marcaciones aplicando los filtros indicados
   *
   * @returns Las marcaciones de la página (más recientes primero) y su paginación
   */
  list: async (filters: MarcacionFilters): Promise<MarcacionesPage> => {
    const response = await protectedHttpClient.get<
      PaginationApiResponse<Marcacion>
    >("/asistencia/marcacion", { params: filters });

    const { total, page, limit, totalPages } = response.data.meta;

    return {
      items: response.data.data,
      pagination: { total, page, limit, totalPages },
    };
  },

  /**
   * Revisa un Excel de marcaciones sin guardar nada
   *
   * @returns El período detectado, las filas válidas y los errores por fila
   */
  validarExcel: async (
    file: File,
  ): Promise<ImportacionMarcacionesValidacion> => {
    const response = await protectedHttpClient.post<
      ApiResponse<ImportacionMarcacionesValidacion>
    >("/asistencia/importacion/validar-excel", buildArchivoBody(file));

    return response.data.data;
  },

  /**
   * Importa el Excel: el backend vuelve a leer el archivo
   *
   * @throws Un 409 si el período está cerrado o la incidencia aprobada, y un 400 si el archivo tiene errores
   */
  importarExcel: async (
    file: File,
  ): Promise<ImportacionMarcacionesResultado> => {
    const response = await protectedHttpClient.post<
      ApiResponse<ImportacionMarcacionesResultado>
    >("/asistencia/importacion/importar-excel", buildArchivoBody(file));

    return response.data.data;
  },
};
