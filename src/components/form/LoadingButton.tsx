import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  /** Mientras es verdadero, el botón se bloquea y muestra la espera */
  isLoading: boolean;
  /** Texto que reemplaza al normal mientras espera, por ejemplo "Guardando…" */
  loadingText?: string;
  /** Icono que se muestra al final cuando no está esperando */
  icon?: LucideIcon;
}

/**
 * Botón que se bloquea y muestra un spinner mientras se envía algo
 *
 * @remarks
 * Acepta las mismas propiedades que `Button`. Si no se indica
 * `loadingText`, mantiene su texto normal durante la espera.
 */
export function LoadingButton({
  isLoading,
  loadingText,
  icon: Icon,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading && <Spinner data-icon="inline-start" />}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && Icon && <Icon data-icon="inline-end" aria-hidden="true" />}
    </Button>
  );
}
