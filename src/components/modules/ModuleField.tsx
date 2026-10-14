import type { ReactNode } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

/** Acompaña cada input con su nombre y mensaje de validacion */
export default function ModuleField({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: { message?: string };
  children: ReactNode;
}) {
  return (
    <Field data-invalid={Boolean(error)} className="gap-1.5 [&_[data-slot=input]]:h-9 [&_[data-slot=input]]:bg-background [&_[data-slot=input]]:text-sm md:[&_[data-slot=input]]:text-xs [&_[data-slot=textarea]]:text-sm md:[&_[data-slot=textarea]]:text-xs">
      <FieldLabel htmlFor={id} className="text-xs">
        {label}
      </FieldLabel>
      {children}
      <FieldError errors={[error]} className="text-xs" />
    </Field>
  );
}
