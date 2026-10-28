import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Bloque de un formulario con icono, título y descripción
 *
 * @remarks
 * Los campos se acomodan en una cuadrícula de hasta cuatro columnas.
 * Un campo que necesite más ancho puede usar `sm:col-span-2` o `lg:col-span-4`.
 */
export function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-xl border bg-card p-4 sm:p-6">
      <header className="flex items-center gap-3 border-b pb-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  );
}
