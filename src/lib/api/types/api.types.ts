/**
 * Representa una respuesta exitosa del backend
 *
 * @typeParam T - Tipo de los datos contenidos en la respuesta
 */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  meta: {
    message: string;
    path: string;
    timestamp: string;
  };
}

/** Datos que devuelve el backend para recorrer un listado */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: ApiResponse<T[]>["meta"] & PaginationMeta;
}
