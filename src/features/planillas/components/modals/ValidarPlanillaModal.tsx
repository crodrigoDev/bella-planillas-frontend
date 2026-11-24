import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CongelarPlanillaSchema,
  type CongelarPlanillaDto,
} from "@jyp/shared-contracts";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FormField } from "@/components/form/FormField";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/apiError.utils";
import { formatPeriodo } from "@/lib/periodo.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { planillasKey } from "../../hooks/usePlanillas";
import { useValidarPlanilla } from "../../hooks/usePlanillaActions";

const resolver = zodResolver(CongelarPlanillaSchema, zodResolverOptions);

type ValidarValues = Parameters<typeof resolver>[0];
type ValidarDatos = CongelarPlanillaDto;

const getSugerenciaValidacion = (mensajeError: string | null): string | null => {
  if (!mensajeError) return null;

  if (mensajeError.includes("cambió desde que fue consultada")) {
    return "Otra persona actualizó esta planilla. Cierra esta ventana para ver los montos actuales.";
  }

  if (
    mensajeError.includes("debe regenerarse") ||
    mensajeError.includes("no concilian")
  ) {
    return "Vuelve a generar la planilla de este mes y revisa los montos antes de validar.";
  }

  return null;
};

interface ValidarPlanillaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planillaId: string;
  /** Versión consultada de la planilla; el backend rechaza el envío si cambió */
  version: number;
  nombre: string;
  periodo: string;
}

/**
 * Modal para validar una planilla abierta, con su motivo obligatorio
 *
 * @remarks
 * El formulario es parte del contrato de la planilla (`version` y `motivo`).
 * El contenido se monta al abrir y se descarta al cerrar, así el error de un
 * intento anterior no queda visible.
 */
export function ValidarPlanillaModal({
  open,
  onOpenChange,
  planillaId,
  version,
  nombre,
  periodo,
}: ValidarPlanillaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <ValidarPlanillaForm
          planillaId={planillaId}
          version={version}
          nombre={nombre}
          periodo={periodo}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ValidarPlanillaFormProps {
  planillaId: string;
  version: number;
  nombre: string;
  periodo: string;
  onClose: () => void;
}

function ValidarPlanillaForm({
  planillaId,
  version,
  nombre,
  periodo,
  onClose,
}: ValidarPlanillaFormProps) {
  const queryClient = useQueryClient();
  const mutation = useValidarPlanilla(planillaId);
  const refrescarAlCerrarRef = useRef(false);

  const methods = useForm<ValidarValues, unknown, ValidarDatos>({
    resolver,
    defaultValues: { version, motivo: "" },
  });

  const esConflicto =
    isAxiosError(mutation.error) && mutation.error.response?.status === 409;

  useEffect(() => {
    if (esConflicto) {
      refrescarAlCerrarRef.current = true;
    }
  }, [esConflicto]);

  useEffect(
    () => () => {
      if (refrescarAlCerrarRef.current) {
        void queryClient.invalidateQueries({
          queryKey: planillasKey.detail(planillaId),
        });
      }
    },
    [queryClient, planillaId],
  );

  const mensajeError = mutation.error
    ? getApiErrorMessage(mutation.error)
    : null;
  const sugerencia = getSugerenciaValidacion(mensajeError);

  const onSubmit = (datos: ValidarDatos) =>
    mutation.mutate(datos, { onSuccess: onClose });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>Validar planilla</DialogTitle>
          <DialogDescription>
            Vas a validar la planilla de {nombre} de{" "}
            {formatPeriodo(periodo)}. Los montos quedan fijos y se habilita la
            boleta. Esta acción no se puede deshacer desde la app.
          </DialogDescription>
        </DialogHeader>

        <FormField
          name="motivo"
          label="Motivo o comentario"
          required
          description="Entre 5 y 1000 caracteres."
        >
          {(invalid) => (
            <Textarea
              id="motivo"
              maxLength={1000}
              placeholder="Explica por qué validas esta planilla"
              aria-invalid={invalid}
              {...methods.register("motivo")}
            />
          )}
        </FormField>

        <ErrorAlert
          error={mutation.error}
          title="No se pudo validar la planilla"
        >
          {sugerencia && <span className="mt-1 block">{sugerencia}</span>}
        </ErrorAlert>

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel="Validar planilla"
          loadingText="Validando…"
        />
      </form>
    </FormProvider>
  );
}
