import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { ContratoEmpleadoFormSchema } from "../../schemas/contrato-empleado.schema";
import type { ContratoFormDto, ContratoFormMode, ContratoFormValues } from "../../types/contrato-empleado.types";
import type { ContratoEmpleado } from "../../types/ficha-empleado.types";
import type { EditarContratoDto } from "@jyp/shared-contracts";
import { addFichaDays } from "../../utils/ficha-empleado.utils";
import EmpleadoContrato from "../form/EmpleadoContrato";

interface ContratoEmpleadoDialogProps {
  mode: ContratoFormMode;
  contrato?: ContratoEmpleado;
  onClose: () => void;
  onSubmit: (values: ContratoFormDto["contrato"] | EditarContratoDto) => void | Promise<void>;
}

/** Reutiliza el formulario del contrato para crear, editar o renovar */
export default function ContratoEmpleadoDialog({ mode, contrato, onClose, onSubmit }: ContratoEmpleadoDialogProps) {
  const [pending, setPending] = useState(false);
  const form = useForm<ContratoFormValues, unknown, ContratoFormDto>({
    resolver: zodResolver(ContratoEmpleadoFormSchema),
    defaultValues: { contrato: {
      tipo_modalidad: contrato?.tipo_modalidad ?? "PLAZO_FIJO",
      fecha_inicio: mode === "renovar" ? (contrato?.fecha_fin ? addFichaDays(contrato.fecha_fin.slice(0, 10), 1) : "") : contrato?.fecha_inicio.slice(0, 10) ?? "",
      fecha_fin: mode === "editar" ? contrato?.fecha_fin?.slice(0, 10) ?? null : null,
      observacion: mode === "editar" ? contrato?.observacion ?? null : null,
      estado: mode === "editar" ? contrato?.estado ?? "VIGENTE" : "VIGENTE",
      contrato_origen_id: contrato?.contrato_origen_id ?? null,
    } },
    mode: "onTouched",
  });
  const { isSubmitting, isDirty, errors, dirtyFields } = form.formState;
  const title = { crear: "Nuevo contrato", editar: "Editar contrato", renovar: "Renovar contrato" }[mode];

  const submit = async (values: ContratoFormDto): Promise<void> => {
    setPending(true);
    try {
      // Al editar solo entrega los campos que se cambiaron
      const data = mode === "editar" ? Object.fromEntries(Object.entries(values.contrato).filter(([key]) => Reflect.get(dirtyFields.contrato ?? {}, key))) : values.contrato;
      await onSubmit(data);
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "No se pudo guardar el contrato" });
    } finally { setPending(false); }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !pending) onClose(); }}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl" showCloseButton={!pending}>
        <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{mode === "renovar" ? "El anterior quedará como Renovado y se creará un nuevo contrato vigente" : "Completa los datos del contrato del empleado"}</DialogDescription></DialogHeader>
        <FormProvider {...form}>
          <form noValidate onSubmit={form.handleSubmit(submit)} className="space-y-5">
            <EmpleadoContrato mode={mode} />
            <FieldError errors={[errors.root]} />
            <DialogFooter><Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>Cancelar</Button><Button type="submit" disabled={isSubmitting || (mode === "editar" && !isDirty)}>{isSubmitting ? "Guardando…" : mode === "renovar" ? "Confirmar renovación" : "Guardar contrato"}</Button></DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
