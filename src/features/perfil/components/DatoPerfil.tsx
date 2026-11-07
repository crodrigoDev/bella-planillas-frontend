import type { ReactNode } from "react";

interface DatoPerfilProps {
  label: string;
  children: ReactNode;
}

/**
 * Una fila de datos del perfil: el nombre a la izquierda y el valor a la derecha
 *
 * @remarks
 * En pantallas angostas el valor baja debajo del nombre.
 */
export function DatoPerfil({ label, children }: DatoPerfilProps) {
  return (
    <div className="grid gap-0.5 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium wrap-break-word">{children}</dd>
    </div>
  );
}
