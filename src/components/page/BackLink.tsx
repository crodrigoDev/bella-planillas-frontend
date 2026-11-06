import type { ReactNode } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface BackLinkProps {
  to: string;
  /** Texto del enlace, por ejemplo "Volver a Empleados" */
  children: ReactNode;
}

/**
 * Enlace con flecha para volver a la página anterior
 */
export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      <ArrowLeftIcon className="size-4" />
      {children}
    </Link>
  );
}
