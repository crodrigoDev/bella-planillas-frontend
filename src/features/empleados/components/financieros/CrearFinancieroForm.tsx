import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CrearDatoFinancieroSchema, type CrearDatoFinancieroDto } from "@jyp/shared-contracts";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { CREAR_EMPLEADO_DEFAULTS } from "../../config/crear-empleado.config";
import { CrearFinancieroFormSchema } from "../../schemas/financiero-empleado.schema";
import type { CrearFinancieroFormDto, CrearFinancieroFormValues } from "../../types/financiero-empleado.types";
import EmpleadoDatosFinancieros from "../form/EmpleadoDatosFinancieros";

interface CrearFinancieroFormProps {
  empleadoId: string;
  onClose: () => void;
  onSubmit: (values: CrearDatoFinancieroDto) => void | Promise<void>;
}

/** Registra la primera ficha financiera usando los mismos campos del alta */
export default function CrearFinancieroForm({ empleadoId, onClose, onSubmit }: CrearFinancieroFormProps) {
  const form = useForm<CrearFinancieroFormValues, unknown, CrearFinancieroFormDto>({ resolver: zodResolver(CrearFinancieroFormSchema), defaultValues: { financiero: CREAR_EMPLEADO_DEFAULTS.financiero }, mode: "onTouched" });
  const { isSubmitting, errors } = form.formState;
  const submit = async (values: CrearFinancieroFormDto): Promise<void> => {
    try { await onSubmit(CrearDatoFinancieroSchema.parse({ ...values.financiero, empleado_id: empleadoId })); }
    catch (error) { form.setError("root", { message: error instanceof Error ? error.message : "No se pudieron registrar los datos financieros" }); }
  };
  return (
    <FormProvider {...form}><form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5">
      <EmpleadoDatosFinancieros />
      <FieldError errors={[errors.root]} />
      <DialogFooter><Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando…" : "Registrar datos financieros"}</Button></DialogFooter>
    </form></FormProvider>
  );
}
