import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CambiarEstadoLaboralSchema, type CambiarEstadoLaboralDto } from "@jyp/shared-contracts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ESTADOS_LABORALES } from "../../config/empleados.config";
import type { EmpleadoListado } from "../../types/empleados.types";
import { getEmpleadoNombre } from "../../utils/empleados.utils";

interface CambiarEstadoLaboralDialogProps {
  empleado: EmpleadoListado;
  onClose: () => void;
  onSubmit: (values: CambiarEstadoLaboralDto) => void | Promise<void>;
}

// Cesado se gestiona con Dar de baja, no con el cambio de estado
const options = CambiarEstadoLaboralSchema.shape.estado_laboral.options.map((value) => ({ value, label: ESTADOS_LABORALES[value].label }));

/** Confirma un nuevo estado operativo sin dar de baja al empleado */
export default function CambiarEstadoLaboralDialog({ empleado, onClose, onSubmit }: CambiarEstadoLaboralDialogProps) {
  const form = useForm<CambiarEstadoLaboralDto>({
    resolver: zodResolver(CambiarEstadoLaboralSchema),
    defaultValues: { estado_laboral: empleado.estado_laboral === "CESADO" ? "ACTIVO" : empleado.estado_laboral, motivo: "" },
    mode: "onTouched",
  });
  const selected = useWatch({ control: form.control, name: "estado_laboral" });
  const { errors, isSubmitting } = form.formState;
  const current = ESTADOS_LABORALES[empleado.estado_laboral];

  const submit = async (values: CambiarEstadoLaboralDto): Promise<void> => {
    try {
      await onSubmit(values);
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "No se pudo cambiar el estado laboral" });
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md" showCloseButton={!isSubmitting}>
        <DialogHeader>
          <DialogTitle>Cambiar estado laboral</DialogTitle>
          <DialogDescription>{getEmpleadoNombre(empleado)} · {empleado.nro_documento}</DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">Estado actual <Badge variant="outline" className={current.className}>{current.label}</Badge></div>
          <Controller name="estado_laboral" control={form.control} render={({ field, fieldState: { error } }) => (
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="nuevo-estado-laboral">Nuevo estado</FieldLabel>
              <Select items={options} value={field.value} disabled={isSubmitting} onValueChange={(value) => { if (value) field.onChange(value); }}>
                <SelectTrigger id="nuevo-estado-laboral" ref={field.ref} onBlur={field.onBlur} className="w-full" aria-invalid={Boolean(error)} aria-describedby={error ? "nuevo-estado-error" : undefined}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {options.map((item) => <SelectItem key={item.value} value={item.value} disabled={item.value === empleado.estado_laboral}>{item.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FieldError id="nuevo-estado-error" errors={[error]} />
            </Field>
          )} />
          <Field data-invalid={Boolean(errors.motivo)}>
            <FieldLabel htmlFor="estado-motivo">Motivo <span className="font-normal text-muted-foreground">Opcional</span></FieldLabel>
            <Textarea {...form.register("motivo")} id="estado-motivo" maxLength={255} disabled={isSubmitting} aria-invalid={Boolean(errors.motivo)} aria-describedby={errors.motivo ? "estado-motivo-error" : undefined} placeholder="Escribe el motivo del cambio" className="max-h-40" />
            <FieldError id="estado-motivo-error" errors={[errors.motivo]} />
          </Field>
          <p className="text-xs text-muted-foreground">El registro seguirá activo. Este cambio es temporal en la vista de prueba.</p>
          <FieldError errors={[errors.root]} />
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || selected === empleado.estado_laboral}>{isSubmitting ? "Guardando…" : "Confirmar cambio"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
