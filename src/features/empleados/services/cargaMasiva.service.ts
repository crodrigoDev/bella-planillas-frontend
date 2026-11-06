import type { CargaMasivaFilaDTO } from "@jyp/shared-contracts";
import { protectedHttpClient } from "@/lib/api/protectedHttpClient";
import type { ApiResponse } from "@/lib/api/types/api.types";
import type {
  CargaMasivaPreValidacion,
  CargaMasivaTrabajo,
} from "../types/cargaMasiva.types";

/**
 * Respuesta de estos endpoints
 *
 * @remarks
 * El controlador ya devuelve un objeto con su propio `data` (o `jobId`) y sin
 * `meta`, así que el interceptor global lo envuelve otra vez: el contenido real
 * queda en `response.data.data.data` (`response.data.data.jobId` al confirmar).
 */
type RespuestaAnidada<T> = ApiResponse<T>;

/** Nombre con el que se guarda la plantilla descargada */
const NOMBRE_PLANTILLA = "plantilla_carga_masiva_empleados.xlsx";

/**
 * Agrupa las operaciones de la importación masiva de empleados
 */
export const cargaMasivaService = {
  /**
   * Descarga la plantilla de Excel y la entrega al navegador
   *
   * @remarks
   * Va por axios y no por un enlace porque la descarga necesita el token.
   */
  descargarPlantilla: async (): Promise<void> => {
    const response = await protectedHttpClient.get<Blob>(
      "/rrhh/empleados-bulk/plantilla",
      { responseType: "blob" },
    );

    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = NOMBRE_PLANTILLA;
    link.click();
    // Se libera después, para no cortar la descarga en algunos navegadores
    setTimeout(() => URL.revokeObjectURL(url), 0);
  },

  /**
   * Revisa un archivo `.xlsx` o `.csv` sin guardar nada
   *
   * @returns El resumen con las filas válidas y los errores por fila
   */
  validar: async (file: File): Promise<CargaMasivaPreValidacion> => {
    const body = new FormData();
    body.append("file", file);

    const response = await protectedHttpClient.post<
      RespuestaAnidada<{ data: CargaMasivaPreValidacion }>
    >("/rrhh/empleados-bulk/validar", body);

    return response.data.data.data;
  },

  /**
   * Manda a guardar las filas válidas en segundo plano
   *
   * @returns El id del trabajo para consultar su avance
   * @remarks El `jobId` viene dentro de `data` porque el interceptor envuelve la respuesta del controlador.
   */
  confirmar: async (filas: CargaMasivaFilaDTO[]): Promise<string> => {
    const response = await protectedHttpClient.post<
      RespuestaAnidada<{ jobId: string }>
    >("/rrhh/empleados-bulk/confirmar", { filas_validas_data: filas });

    return response.data.data.jobId;
  },

  /**
   * Consulta el avance de un trabajo
   *
   * @throws Un 404 si el trabajo no existe o lo inició otro usuario
   */
  getEstado: async (jobId: string): Promise<CargaMasivaTrabajo> => {
    const response = await protectedHttpClient.get<
      RespuestaAnidada<{ data: CargaMasivaTrabajo }>
    >(`/rrhh/empleados-bulk/${jobId}`);

    return response.data.data.data;
  },
};
