import { Check } from "lucide-react";
import { JORNADA_STEPS } from "../../config/jornada-form.config";

/** Indica el paso actual y los pasos que ya se completaron */
export default function JornadaSteps({ step }: { step: number }) {
  return (
    <ol
      aria-label="Pasos para crear jornada"
      className="mx-auto flex max-w-lg justify-center py-6"
    >
      {JORNADA_STEPS.map((label, index) => (
        <li
          key={label}
          aria-current={step === index ? "step" : undefined}
          className="relative flex flex-1 flex-col items-center gap-2 text-center"
        >
          {index < 2 && (
            <span
              aria-hidden
              className={`absolute left-[calc(50%+24px)] right-[calc(-50%+24px)] top-4 h-px ${step > index ? "bg-primary" : "bg-border"}`}
            />
          )}
          <span
            className={`relative flex size-8 items-center justify-center rounded-full text-xs font-semibold ${step >= index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {step > index ? (
              <Check aria-hidden className="size-4" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={`text-[11px] ${step >= index ? "text-primary" : "text-muted-foreground"}`}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}
