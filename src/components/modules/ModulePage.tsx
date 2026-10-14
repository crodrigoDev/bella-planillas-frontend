import { useId, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModulePageProps {
  title: string;
  description: string;
  action?: ReactNode;
  message?: string;
  children: ReactNode;
}

/** Comparte los estilos del listado de empleados entre los modulos */
export default function ModulePage({
  title,
  description,
  action,
  message,
  children,
}: ModulePageProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className="-m-4 min-h-full space-y-6 bg-[#faf9ff] p-4 text-slate-700 dark:bg-background dark:text-foreground sm:p-6 lg:p-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            id={titleId}
            className="text-xl font-semibold tracking-tight text-slate-950 dark:text-foreground"
          >
            {title}
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-muted-foreground">
            {description}
          </p>
        </div>
        {action && <div className="flex flex-wrap gap-2">{action}</div>}
      </header>
      {message && (
        <Alert
          role="status"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
        >
          <Check aria-hidden />
          <AlertDescription className="text-inherit">
            {message}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </section>
  );
}
