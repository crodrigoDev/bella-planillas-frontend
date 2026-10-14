import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface EmpleadoFormSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
}

/** Agrupa campos relacionados dentro de una tarjeta */
export default function EmpleadoFormSection({
  title,
  description,
  icon: Icon,
  children,
}: EmpleadoFormSectionProps) {
  return (
    <Card className="gap-5 py-5 shadow-none ring-border sm:py-6">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/7 text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          {title}
        </h3>
        {description && (
          <p className="text-[11px] text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="grid gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {children}
      </CardContent>
    </Card>
  );
}
