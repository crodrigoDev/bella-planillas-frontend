import type { ReactNode } from "react";
import { TriangleAlertIcon } from "lucide-react";

import { TONE_BADGE } from "@/components/feedback/statusTone.config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface AvisoJornadaProps {
  children: ReactNode;
  /** Elemento a la derecha del texto, por ejemplo un botón */
  action?: ReactNode;
}

/**
 * Aviso de tono ámbar para lo que falta de jornada en la pestaña de asistencia
 *
 * @remarks
 * Es un aviso, no un error: usa los tokens del tono `warning`.
 */
export function AvisoJornada({ children, action }: AvisoJornadaProps) {
  return (
    <Alert className={TONE_BADGE.warning}>
      <TriangleAlertIcon aria-hidden />
      <AlertDescription
        className={cn(
          "text-warning-soft-foreground",
          action && "flex flex-wrap items-center justify-between gap-2",
        )}
      >
        <span>{children}</span>
        {action}
      </AlertDescription>
    </Alert>
  );
}
