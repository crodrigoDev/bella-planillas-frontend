import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CREAR_EMPLEADO_STEPS } from "../../config/crear-empleado.config";

/** Indica el paso actual y los pasos que ya se completaron */
export default function EmpleadoRegistroSteps({ current }: { current: number }) {
  return (
    <ol aria-label="Pasos del registro" className="grid grid-cols-5 py-2">
      {CREAR_EMPLEADO_STEPS.map((step, index) => (
        <li key={step.title} aria-current={current === index ? "step" : undefined} className="relative flex flex-col items-center gap-2 px-1 text-center">
          {index < CREAR_EMPLEADO_STEPS.length - 1 && <span aria-hidden="true" className={cn("absolute top-4 left-1/2 h-px w-full", index < current ? "bg-primary" : "bg-border")} />}
          <span className={cn("relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold", index <= current ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground")}>
            {index < current ? <Check aria-hidden="true" className="size-4" /> : index + 1}
          </span>
          <div>
            <p className={cn("text-[10px] font-medium sm:text-xs", index === current ? "text-primary" : "text-muted-foreground")}>{step.title}</p>
            <p className="mt-1 hidden text-[11px] text-muted-foreground sm:block">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
