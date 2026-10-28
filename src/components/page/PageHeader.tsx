import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Id del título, para enlazarlo con `aria-labelledby` de la sección */
  id: string;
  title: string;
  description?: string;
  /** Botón u otro elemento a la derecha, por ejemplo "Nuevo empleado" */
  action?: ReactNode;
}

/**
 * Encabezado de una página: título, descripción y una acción opcional
 */
export function PageHeader({
  id,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 id={id} className="text-2xl font-semibold">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action}
    </header>
  );
}
