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
