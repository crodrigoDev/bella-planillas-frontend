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
    <Field data-invalid={Boolean(error)} className="gap-1.5">
      <FieldLabel htmlFor={id} className="text-xs">
        {label}
      </FieldLabel>
      {children}
      <FieldError errors={[error]} className="text-xs" />
    </Field>
  );
}
