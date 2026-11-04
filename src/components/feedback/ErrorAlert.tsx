import type { ReactNode } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api/get-api-error-message";
import { cn } from "@/lib/utils";

interface ErrorAlertProps {
  /** Error de una consulta o mutación; si es null o undefined no se muestra nada */
  error: unknown;
  title?: string;
  /** Texto que se agrega después del mensaje del error */
  children?: ReactNode;
  /** Si se indica, muestra a la derecha un botón "Reintentar" que lo llama */
  onRetry?: () => void;
  /** Otro elemento a la derecha; se ignora si hay `onRetry` */
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
  onRetry,
  action,
}: ErrorAlertProps) {
  if (!error) return null;

  const accion = onRetry ? (
    <Button variant="outline" size="sm" onClick={onRetry}>
      Reintentar
    </Button>
  ) : (
    action
  );

  return (
    <Alert variant="destructive">
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription
        className={cn(accion && "flex items-center justify-between gap-2")}
      >
        <span>
          {getApiErrorMessage(error)}
          {children}
        </span>
        {accion}
      </AlertDescription>
    </Alert>
  );
}
