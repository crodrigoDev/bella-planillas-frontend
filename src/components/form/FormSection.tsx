import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Bloque de un formulario: el título y la descripción a la izquierda, los campos a la derecha
 *
 * @remarks
 * Las secciones se separan con una línea y no con tarjetas. Los campos se
 * acomodan en 1, 2 o 3 columnas según el ancho; un campo que necesite más
 * ancho puede usar `sm:col-span-2`, o `col-span-full` para ocupar toda la fila.
 */
export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="grid gap-4 border-t pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-8">
      <header>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
