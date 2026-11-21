import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import { TextField } from "@/components/form/TextField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useGuardarDiaCalendario } from "../../hooks/useCalendario";
import { DiaCalendarioFormSchema } from "../../schemas/asistencia.schema";
import type {
  AccionDiaCalendario,
  DiaCalendarioAsistencia,
} from "../../types/calendario.types";
import { formatFechaCompleta } from "../../utils/asistencia.utils";
import { MotivoField } from "../MotivoField";

const resolver = zodResolver(DiaCalendarioFormSchema, zodResolverOptions);

type DiaCalendarioValues = Parameters<typeof resolver>[0];
type DiaCalendarioDatos = typeof DiaCalendarioFormSchema._output;

/** Error del campo fecha cuando el mes ya está cerrado */
const TEXTO_MES_CERRADO =
  "Ese mes está cerrado. Reabre sus resúmenes antes de cambiar el calendario.";

/** Error del campo fecha cuando ya hay un día acordado que el guardado pisaría */
const TEXTO_DIA_EXISTENTE =
  "Ya hay un día acordado en esa fecha. Edítalo desde la tabla.";

interface DiaCalendarioModalProps {
  /** Día que se edita; null cuando se agrega uno nuevo */
  dia: DiaCalendarioAsistencia | null;
  /** Meses cerrados del año mostrado (YYYY-MM) */
  mesesCerrados: string[];
  /** Días del año mostrado, para avisar si la fecha ya es un feriado nacional */
  dias: DiaCalendarioAsistencia[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para agregar o editar un día de descanso acordado
 *
 * @remarks
 * El backend guarda por fecha: al editar, la fecha no se puede cambiar. Al
 * crear se rechaza una fecha que ya tenga un día acordado, porque el guardado
 * es un upsert y lo sobrescribiría sin avisar. El formulario está dentro del
 * contenido, así que se desmonta al cerrarse.
 */
export function DiaCalendarioModal({
  dia,
  mesesCerrados,
  dias,
  open,
  onOpenChange,
}: DiaCalendarioModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DiaCalendarioForm
          dia={dia}
          mesesCerrados={mesesCerrados}
          dias={dias}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface DiaCalendarioFormProps {
  dia: DiaCalendarioAsistencia | null;
  mesesCerrados: string[];
  dias: DiaCalendarioAsistencia[];
  onClose: () => void;
}

/** Qué se está haciendo con el día, para elegir el aviso de éxito */
const getAccion = (
  values: DiaCalendarioDatos,
  dia: DiaCalendarioAsistencia | null,
): AccionDiaCalendario => {
  if (!dia) return "CREAR";
  if (values.activo === dia.activo) return "EDITAR";

  return values.activo ? "ACTIVAR" : "DESACTIVAR";
};

function DiaCalendarioForm({
  dia,
  mesesCerrados,
  dias,
  onClose,
}: DiaCalendarioFormProps) {
  const mutation = useGuardarDiaCalendario();
  const esEdicion = dia !== null;

  const methods = useForm<DiaCalendarioValues, unknown, DiaCalendarioDatos>({
    resolver,
    defaultValues: {
      fecha: dia?.fecha ?? "",
      nombre: dia?.nombre ?? "",
      motivo: dia?.motivo ?? "",
      activo: dia?.activo ?? true,
    },
  });

  const fecha = useWatch({ control: methods.control, name: "fecha" });
  const mes = fecha?.slice(0, 7) ?? "";
  const mesCerrado = Boolean(mes) && mesesCerrados.includes(mes);
  const feriado = dias.find(
    (otro) => otro.origen === "NACIONAL" && otro.fecha === fecha,
  );
  // Al crear, el guardado es un upsert por fecha: no se puede pisar un día acordado
  const diaExistente = esEdicion
    ? undefined
    : dias.find((otro) => otro.origen === "ADICIONAL" && otro.fecha === fecha);
  // Un solo error de fecha: el mes cerrado manda sobre el día ya existente
  const errorFecha = mesCerrado
    ? TEXTO_MES_CERRADO
    : diaExistente
      ? TEXTO_DIA_EXISTENTE
      : null;

  // El error se quita al elegir una fecha que sí se puede guardar
  useEffect(() => {
    if (errorFecha) {
      methods.setError("fecha", {
        type: "manual",
        message: errorFecha,
      });
    } else {
      methods.clearErrors("fecha");
    }
  }, [errorFecha, methods]);

  const onSubmit = (values: DiaCalendarioDatos) => {
    if (errorFecha) {
      methods.setError("fecha", {
        type: "manual",
        message: errorFecha,
      });
      return;
    }

    mutation.mutate(
      { dto: values, accion: getAccion(values, dia) },
      { onSuccess: onClose },
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4"
      >
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar día" : "Agregar día"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Actualiza el día de descanso acordado. La fecha no se puede cambiar."
              : "Registra un día de descanso acordado."}{" "}
            El día se aplica a todos los colaboradores.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="fecha"
            label="Fecha"
            required
            type="date"
            readOnly={esEdicion}
            description={
              esEdicion
                ? "La fecha no se puede cambiar. Si es otra, desactiva este día y agrega uno nuevo."
                : undefined
            }
          />
          <TextField
            name="nombre"
            label="Nombre"
            required
            maxLength={150}
            placeholder="Ej. Día de la empresa"
          />
          <MotivoField placeholder="Por qué se acuerda este día" />

          {esEdicion && (
            <Field className="col-span-full">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  {...methods.register("activo")}
                />
                Activo
              </label>
              <p className="text-sm text-muted-foreground">
                Un día inactivo se conserva en el calendario, pero no cuenta
                como descanso.
              </p>
            </Field>
          )}
        </div>

        {feriado && (
          <Alert>
            <AlertDescription>
              La fecha elegida ({formatFechaCompleta(feriado.fecha)}) ya es
              feriado nacional: {feriado.nombre}. El día acordado se guardará
              igual.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription>
            Si el mes ya tiene resúmenes generados, quedarán desactualizados y
            no se podrán aprobar hasta regenerarlos en{" "}
            <Link
              to={
                mes
                  ? `${ROUTE_PATHS.asistencia.cierreMensual}?periodo=${mes}`
                  : ROUTE_PATHS.asistencia.cierreMensual
              }
              className="underline"
            >
              Cierre mensual
            </Link>
            .
          </AlertDescription>
        </Alert>

        <ErrorAlert error={mutation.error} />

        <ModalFormFooter
          isPending={mutation.isPending}
          submitLabel={esEdicion ? "Guardar" : "Agregar"}
        />
      </form>
    </FormProvider>
  );
}
