import { isAxiosError } from "axios";

/**
 * Obtiene un mensaje para presentar un error de una petición HTTP
 *
 * @param error - Error producido al ejecutar la operación
 * @returns Un mensaje para mostrar al usuario
 */
export function getApiErrorMessage(error: unknown): string {
  const fallBackMessage =
    "No se pudo completar la operación. Inténtalo nuevamente.";

  if (!isAxiosError<{ detail?: unknown }>(error)) return fallBackMessage;

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    return "El servidor tardó demasiado en responder. Inténtalo nuevamente.";

  if (!error.response)
    return "No se pudo conectar con el servidor. Inténtalo nuevamente";

  if (error.response.status >= 500)
    return "Ocurrió un problema en el servidor. Inténtalo más tarde.";

  const detail = error.response.data?.detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  return fallBackMessage;
}
