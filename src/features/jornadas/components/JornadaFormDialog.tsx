import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearJornadaSchema,
  type CrearJornadaDto,
} from "@jyp/shared-contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  JornadaFormValues,
  JornadaListado,
} from "../types/jornadas.types";
import { prepararJornada } from "../utils/jornada-form.utils";
import JornadaGeneralFields from "./form/JornadaGeneralFields";
import JornadaScheduleFields from "./form/JornadaScheduleFields";

/** Reutiliza los campos de la pagina de registro para editar una jornada */
export default function JornadaFormDialog({
  jornada,
  onClose,
  onSave,
}: {
  jornada: JornadaListado;
  onClose: () => void;
  onSave: (values: CrearJornadaDto) => void;
}) {
  const form = useForm<JornadaFormValues, unknown, CrearJornadaDto>({
    resolver: zodResolver(CrearJornadaSchema),
    defaultValues: jornada,
  });
  const submit = (values: CrearJornadaDto): void => {
    try {
      onSave(prepararJornada(values));
      onClose();
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "No se pudo guardar la jornada",
      });
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar jornada</DialogTitle>
          <DialogDescription>
            Datos generales y horario semanal
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(submit)}
            className="space-y-6"
          >
            <JornadaGeneralFields />
            <div className="border-t pt-6">
              <JornadaScheduleFields />
            </div>
            {form.formState.errors.root && (
              <p role="alert" className="text-xs text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Guardar jornada</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
