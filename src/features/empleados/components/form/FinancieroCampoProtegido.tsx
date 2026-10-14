import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { EmpleadoFormValues } from "../../types/empleado-form.types";
import type { CampoFinancieroSensible } from "../../types/financiero-empleado.types";
import EmpleadoInputField from "./EmpleadoInputField";

interface FinancieroCampoProtegidoProps {
  name: CampoFinancieroSensible;
  label: string;
  maxLength: number;
  placeholder?: string;
  editing?: boolean;
  mask?: string | null;
  cleared?: boolean;
  onToggleClear?: (name: CampoFinancieroSensible) => void;
}

/** Permite reemplazar o borrar un dato sin usar la mascara como valor del input */
export default function FinancieroCampoProtegido({ name, label, maxLength, placeholder, editing = false, mask, cleared = false, onToggleClear }: FinancieroCampoProtegidoProps) {
  const { formState: { isSubmitting } } = useFormContext<EmpleadoFormValues>();
  return (
    <div className="min-w-0 space-y-2">
      <EmpleadoInputField name={`financiero.${name}`} label={label} maxLength={maxLength} inputMode={name === "cuspp" ? "text" : "numeric"} placeholder={editing ? "Escribe un nuevo valor" : placeholder} emptyValue={editing ? null : undefined} disabled={cleared} />
      {editing && mask && <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground"><span className="break-all">{cleared ? "Se borrará al guardar" : `Guardado: ${mask}`}</span><Button type="button" variant="ghost" size="xs" aria-label={`${cleared ? "Conservar" : "Borrar"} ${label.toLowerCase()}`} disabled={isSubmitting} onClick={() => onToggleClear?.(name)}>{cleared ? "Conservar dato" : "Borrar dato"}</Button></div>}
    </div>
  );
}
