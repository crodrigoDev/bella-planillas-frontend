import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActualizarDatoFinancieroSchema, type ActualizarDatoFinancieroDto } from "@jyp/shared-contracts";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { EditarFinancieroFormSchema } from "../../schemas/financiero-empleado.schema";
import { PASSWORD_FINANCIERO_MOCK } from "../../data/financieros-empleado.mock";
import type { CampoFinancieroSensible, EditarFinancieroFormDto, EditarFinancieroFormValues, FinancieroEmpleado } from "../../types/financiero-empleado.types";
import EmpleadoDatosFinancieros from "../form/EmpleadoDatosFinancieros";
import EmpleadoInputField from "../form/EmpleadoInputField";

interface EditarFinancieroFormProps {
  financiero: FinancieroEmpleado;
  onClose: () => void;
  onSubmit: (values: ActualizarDatoFinancieroDto) => void | Promise<void>;
}

/** Edita solo los campos cambiados y conserva las cuentas que no se tocaron */
export default function EditarFinancieroForm({ financiero, onClose, onSubmit }: EditarFinancieroFormProps) {
  const [cleared, setCleared] = useState<Set<CampoFinancieroSensible>>(() => new Set());
  const form = useForm<EditarFinancieroFormValues, unknown, EditarFinancieroFormDto>({
    resolver: zodResolver(EditarFinancieroFormSchema),
    defaultValues: { password_confirmacion: "", financiero: {
      id_regimen: financiero.id_regimen, id_tipo_afp: financiero.id_tipo_afp, tipo_comision: financiero.tipo_comision, sueldo_basico: financiero.sueldo_basico,
      id_banco_sueldo: financiero.id_banco_sueldo, tipo_cuenta_sueldo: financiero.tipo_cuenta_sueldo,
      id_banco_cts: financiero.id_banco_cts, tipo_cuenta_cts: financiero.tipo_cuenta_cts,
      regimen_salud: financiero.regimen_salud, eps_nombre: financiero.eps_nombre, eps_plan: financiero.eps_plan, eps_costo_adicional: financiero.eps_costo_adicional,
      // Nunca llena los inputs con los valores enmascarados de la consulta
      cuspp: null, nro_cuenta_sueldo: null, cci_sueldo: null, nro_cuenta_cts: null, cci_cts: null,
    } },
    mode: "onTouched",
  });
  const { errors, isSubmitting, dirtyFields } = form.formState;
  const hasChanges = Object.values(dirtyFields.financiero ?? {}).some(Boolean) || cleared.size > 0;

  const toggleClear = (name: CampoFinancieroSensible): void => {
    // Conservar dato vuelve al campo vacio sin dejar un cambio pendiente
    form.resetField(`financiero.${name}`, { defaultValue: null });
    setCleared((actual) => { const next = new Set(actual); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  };
  const clearCuspp = (): void => {
    if (financiero.cuspp) setCleared((actual) => new Set(actual).add("cuspp"));
  };
  const submit = async (values: EditarFinancieroFormDto): Promise<void> => {
    if (!hasChanges) return;
    try {
      const cambios = Object.fromEntries(Object.entries(values.financiero).filter(([key]) => Reflect.get(dirtyFields.financiero ?? {}, key)));
      for (const key of cleared) cambios[key] = null;
      await onSubmit(ActualizarDatoFinancieroSchema.parse({ ...cambios, password_confirmacion: values.password_confirmacion }));
      form.resetField("password_confirmacion");
    } catch (error) { form.setError("root", { message: error instanceof Error ? error.message : "No se pudieron actualizar los datos financieros" }); }
  };
  return (
    <FormProvider {...form}><form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <p className="text-xs text-muted-foreground">Deja vacíos los campos de cuentas y CUSPP para conservarlos. Usa Borrar dato si quieres eliminarlos.</p>
      <EmpleadoDatosFinancieros editing current={financiero} cleared={cleared} onToggleClear={toggleClear} onClearCuspp={clearCuspp} />
      <div className="space-y-2 rounded-lg border p-4">
        <EmpleadoInputField name="password_confirmacion" label="Confirma tu contraseña" type="password" autoComplete="current-password" emptyValue="" required />
        <p className="text-xs text-muted-foreground">Vista de prueba: usa {PASSWORD_FINANCIERO_MOCK}</p>
      </div>
      <FieldError errors={[errors.root]} />
      <DialogFooter><Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={isSubmitting || !hasChanges}>{isSubmitting ? "Guardando…" : "Guardar datos financieros"}</Button></DialogFooter>
    </form></FormProvider>
  );
}
