import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Mantiene el mismo borde, titulo y separacion en los bloques del resumen */
export default function DashboardPanel({
  title,
  description,
  action,
  children,
  footer,
  className = "",
}: {
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`gap-0 border border-indigo-100/80 py-0 shadow-sm ring-0 dark:border-border ${className}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="text-xs font-semibold">{title}</h2>
          {description && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <CardContent className="flex-1 border-t border-border/50 px-5 py-4">
        {children}
      </CardContent>
      {footer && (
        <footer className="mx-5 border-t border-border/50 py-3 text-[10px] text-muted-foreground">
          {footer}
        </footer>
      )}
    </Card>
  );
}
