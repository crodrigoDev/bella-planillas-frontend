import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { cn } from "@/lib/utils";

interface ErrorAlertProps {
  /** Error de una consulta o mutación; si es null o undefined no se muestra nada */
  error: unknown;
  title?: string;
  /** Texto que se agrega después del mensaje del error */
  children?: ReactNode;
  /** Botón u otro elemento a la derecha, por ejemplo "Reintentar" */
  action?: ReactNode;
}

/**
 * Alerta roja con el mensaje de un error de una petición al backend
 *
 * @remarks
 * El mensaje sale de `getApiErrorMessage`. Se puede usar sin condición:
 * `<ErrorAlert error={mutation.error} />` solo aparece si hay error.
 */
export function ErrorAlert({
  error,
  title,
  children,
  action,
}: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription
        className={cn(action && "flex items-center justify-between gap-2")}
      >
        <span>
          {getApiErrorMessage(error)}
          {children}
        </span>
        {action}
      </AlertDescription>
    </Alert>
  );
}
