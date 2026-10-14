import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModulePageProps {
  title: string;
  description: string;
  action?: ReactNode;
  message?: string;
  children: ReactNode;
}

/** Comparte el encabezado y el espacio de las vistas de demostracion */
export default function ModulePage({
  title,
  description,
  action,
  message,
  children,
}: ModulePageProps) {
  return (
    <section className="-m-4 min-h-full space-y-6 bg-[#faf9ff] p-4 dark:bg-background sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="border-primary/15 bg-primary/5 text-primary"
          >
            Vista de prueba
          </Badge>
          {action}
        </div>
      </header>
      {message && (
        <Alert role="status">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {children}
    </section>
  );
}
