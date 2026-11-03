import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { FileDropzone } from "@/components/form/FileDropzone";
import { LoadingButton } from "@/components/form/LoadingButton";
import { SelectField } from "@/components/form/SelectField";
import { TextField } from "@/components/form/TextField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  SUSTENTO_MAX_BYTES,
  SUSTENTO_TIPOS_ARCHIVO,
  TIPO_SUSTENTO_OPTIONS,
} from "../../config/derechohabientes.config";
import { useSubirSustento } from "../../hooks/useDerechohabienteActions";
import { useDerechohabienteSustentos } from "../../hooks/useDerechohabientes";
import { SustentoFormSchema } from "../../schemas/sustento.schema";
import type { Derechohabiente } from "../../types/derechohabientes.types";

const resolver = zodResolver(SustentoFormSchema, zodResolverOptions);

type SustentoValues = Parameters<typeof resolver>[0];
type SustentoDatos = typeof SustentoFormSchema._output;

interface SustentosModalProps {
  derechohabiente: Derechohabiente;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal con los sustentos de un derechohabiente y el formulario para adjuntar otro
 *
 * @remarks
 * Muestra lo ya adjuntado (tipo, nombre y fechas), pero no permite abrir los
 * archivos: el backend todavía no tiene cómo descargarlos. El contenido está
 * dentro del modal: se pide y se arma al abrir, y se descarta al cerrar.
 */
export function SustentosModal({
  derechohabiente,
  open,
  onOpenChange,
}: SustentosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <SustentosContent
          derechohabiente={derechohabiente}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface SustentosContentProps {
  derechohabiente: Derechohabiente;
  onClose: () => void;
}

function SustentosContent({ derechohabiente, onClose }: SustentosContentProps) {
  const { data, error, isLoading } = useDerechohabienteSustentos(
    derechohabiente.id,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Sustentos</DialogTitle>
        <DialogDescription>
          Documentos que acreditan el vínculo de {derechohabiente.nombres}{" "}
          {derechohabiente.apellidos}.
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : data?.documentos.length ? (
        <ul className="divide-y rounded-lg border">
          {data.documentos.map((sustento) => (
            <li
              key={sustento.id}
              className="flex items-start justify-between gap-3 px-3 py-2.5"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium">
                  {getOptionLabel(TIPO_SUSTENTO_OPTIONS, sustento.tipo_documento)}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {sustento.nombre_archivo}
                </p>
                {(sustento.fecha_emision || sustento.fecha_vencimiento) && (
                  <p className="text-xs text-muted-foreground">
                    {sustento.fecha_emision &&
                      `Emitido el ${formatDate(sustento.fecha_emision)}`}
                    {sustento.fecha_emision &&
                      sustento.fecha_vencimiento &&
                      ", "}
                    {sustento.fecha_vencimiento &&
                      `vence el ${formatDate(sustento.fecha_vencimiento)}`}
                  </p>
                )}
              </div>
              {sustento.vigente && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  Vigente
                </Badge>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
          Todavía no hay sustentos adjuntos.
        </p>
      )}

      <SustentoForm derechohabienteId={derechohabiente.id} onClose={onClose} />
    </>
  );
}

interface SustentoFormProps {
  derechohabienteId: string;
  onClose: () => void;
}

// Mismas reglas que el backend, para avisar antes de enviar
const getArchivoError = (file: File | null): string | null => {
  if (!file) return null;
  if (!SUSTENTO_TIPOS_ARCHIVO.includes(file.type))
    return "El archivo debe ser un PDF o un documento de Word.";
  if (file.size > SUSTENTO_MAX_BYTES)
    return "El archivo no puede superar los 5 MB.";

  return null;
};

function SustentoForm({ derechohabienteId, onClose }: SustentoFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const mutation = useSubirSustento();

  const methods = useForm<SustentoValues, unknown, SustentoDatos>({
    resolver,
  });

  const archivoError = getArchivoError(file);

  const onSubmit = (values: SustentoDatos) => {
    if (!file || archivoError) return;

    mutation.mutate(
      { dto: { ...values, derechohabiente_id: derechohabienteId }, file },
      { onSuccess: onClose },
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4 border-t pt-4"
      >
        <p className="text-sm font-medium">Adjuntar un sustento</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            name="tipo_documento"
            label="Tipo de documento"
            required
            options={TIPO_SUSTENTO_OPTIONS}
            placeholder="Selecciona un tipo"
            fieldClassName="col-span-full"
          />
          <TextField
            name="fecha_emision"
            label="Fecha de emisión"
            optional
            type="date"
          />
          <TextField
            name="fecha_vencimiento"
            label="Fecha de vencimiento"
            optional
            type="date"
          />
        </div>

        <Field>
          <FieldLabel htmlFor="sustento-archivo">Archivo</FieldLabel>
          <FileDropzone
            id="sustento-archivo"
            file={file}
            onChange={setFile}
            accept=".pdf,.doc,.docx"
            hint="PDF o Word"
            invalid={Boolean(archivoError)}
            disabled={mutation.isPending}
          />
          {archivoError && <FieldError>{archivoError}</FieldError>}
        </Field>

        <ErrorAlert error={mutation.error} />

        <DialogFooter>
          <DialogClose
            render={<Button type="button" variant="outline" />}
            disabled={mutation.isPending}
          >
            Cerrar
          </DialogClose>
          <LoadingButton
            type="submit"
            isLoading={mutation.isPending}
            loadingText="Subiendo…"
            disabled={!file || Boolean(archivoError)}
          >
            Adjuntar
          </LoadingButton>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
