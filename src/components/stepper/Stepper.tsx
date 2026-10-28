import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperStep {
  id: string;
  label: string;
  /** Texto bajo la etiqueta mientras el paso no se alcanza (por ejemplo "(Opcional)") */
  pendingCaption?: string;
}

interface StepperProps {
  steps: readonly StepperStep[];
  /** Posición del paso actual, empezando en 0 */
  currentStep: number;
  className?: string;
}

type StepStatus = "completed" | "current" | "pending";

const CAPTIONS: Record<Exclude<StepStatus, "pending">, string> = {
  completed: "Completado",
  current: "En curso",
};

const getStatus = (index: number, currentStep: number): StepStatus => {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "current";

  return "pending";
};

/**
 * Muestra el avance de un proceso de varios pasos
 *
 * @remarks
 * Solo muestra el estado: no cambia de paso por sí solo. Quien lo usa
 * decide el paso actual. Los pasos anteriores aparecen completados y
 * los siguientes pendientes.
 */
export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol
      aria-label="Progreso"
      className={cn(
        "grid rounded-xl border bg-card p-4 sm:p-6",
        // Una columna del mismo ancho por cada paso
        "[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]",
        className,
      )}
      style={{ "--steps": steps.length } as React.CSSProperties}
    >
      {steps.map((step, index) => {
        const status = getStatus(index, currentStep);
        const isLast = index === steps.length - 1;
        const caption =
          status === "pending"
            ? (step.pendingCaption ?? "Pendiente")
            : CAPTIONS[status];

        return (
          <li
            key={step.id}
            aria-current={status === "current" ? "step" : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {/* Línea hasta el centro del siguiente paso */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 left-1/2 h-0.5 w-full -translate-y-1/2",
                  index < currentStep ? "bg-primary" : "bg-border",
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                status === "pending" &&
                  "border-border bg-card text-muted-foreground",
                status === "completed" &&
                  "border-primary bg-primary text-primary-foreground",
                status === "current" &&
                  "border-primary bg-primary text-primary-foreground ring-4 ring-primary/20",
              )}
            >
              {status === "completed" ? (
                <CheckIcon className="size-5" />
              ) : (
                index + 1
              )}
            </span>

            <span className="flex flex-col">
              <span
                className={cn(
                  "text-sm font-medium",
                  status === "current" ? "text-primary" : "text-foreground",
                  status === "pending" && "text-muted-foreground",
                )}
              >
                {index + 1}. {step.label}
              </span>
              <span
                className={cn(
                  "text-xs",
                  status === "current"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {caption}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
