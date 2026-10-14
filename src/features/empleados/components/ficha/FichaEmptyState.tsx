import type { LucideIcon } from "lucide-react";

interface FichaEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Muestra un estado vacio dentro de la ficha */
export default function FichaEmptyState({ icon: Icon, title, description }: FichaEmptyStateProps) {
  return (
    <div className="rounded-xl border bg-background px-5 py-12 text-center">
      <Icon aria-hidden="true" className="mx-auto mb-3 size-7 text-muted-foreground/50" />
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
