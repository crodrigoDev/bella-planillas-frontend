/**
 * Metadatos comunes a todas las respuestas exitosas del backend
 */
export interface ApiMeta {
  message: string;
  path: string;
  timestamp: string;
}

/**
 * Representa una respuesta exitosa del backend
 *
 * @typeParam T - Tipo de los datos contenidos en la respuesta
 */
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  meta: ApiMeta;
}

/**
 * Datos de paginación que calcula el servidor
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Representa una respuesta exitosa del backend con una lista paginada
 *
 * @typeParam T - Tipo de elemento de la lista
 */
export interface PaginationApiResponse<T> {
  statusCode: number;
  data: T[];
  meta: ApiMeta & PaginationMeta;
}
