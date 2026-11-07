import { Link } from "react-router-dom";
import { buildEmpleadoPath } from "@/app/routes/path";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { LoadingButton } from "@/components/form/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGenerarMes } from "../../hooks/useCierreMensualActions";
import type { CierreProgreso } from "../../types/incidencias.types";
import { formatPeriodo } from "../../utils/asistencia.utils";

interface GenerarMesModalProps {
  periodo: string;
  /** Si se filtra por área, solo se calculan sus colaboradores */
  areaId?: string;
  areaNombre?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para calcular el resumen de todos los colaboradores del mes
 *
 * @remarks
 * Se monta solo mientras está abierto: al cerrarse se descarta el avance. No se
 * puede cerrar mientras calcula; sí al terminar o al fallar.
 */
export function GenerarMesModal({
  open,
  onOpenChange,
  ...props
}: GenerarMesModalProps) {
  if (!open) return null;

  return <GenerarMesDialog {...props} onClose={() => onOpenChange(false)} />;
}

interface GenerarMesDialogProps {
  periodo: string;
  areaId?: string;
  areaNombre?: string;
  onClose: () => void;
}

function GenerarMesDialog({
  periodo,
  areaId,
  areaNombre,
  onClose,
}: GenerarMesDialogProps) {
  const { mutate, progreso, isIdle, isPending, isSuccess, error } =
    useGenerarMes();

  const handleGenerar = () => mutate({ periodo, areaId });

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) onClose();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Generar {formatPeriodo(periodo)}</DialogTitle>
          <DialogDescription>
            Calcula el resumen de asistencia de{" "}
            {areaNombre
              ? `los colaboradores del área ${areaNombre}`
              : "todos los colaboradores"}{" "}
            con vínculo en el mes. Si ya tenían resumen, se actualiza. Puede
            tardar unos minutos: no cierres la página mientras avanza.
          </DialogDescription>
        </DialogHeader>

        {!isIdle && (
          <Avance
            progreso={progreso}
            isPending={isPending}
            isSuccess={isSuccess}
            periodo={periodo}
          />
        )}

        <ErrorAlert
          error={error}
          title="Se interrumpió la generación"
        >
          Lo ya calculado quedó guardado. Puedes volver a intentarlo.
        </ErrorAlert>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            {isSuccess ? "Cerrar" : "Cancelar"}
          </Button>
          {!isSuccess && (
            <LoadingButton
              isLoading={isPending}
              loadingText="Generando…"
              onClick={handleGenerar}
            >
              {error ? "Reintentar" : "Generar"}
            </LoadingButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AvanceProps {
  progreso: CierreProgreso;
  isPending: boolean;
  isSuccess: boolean;
  periodo: string;
}

/** Cifras acumuladas de la generación y la lista de colaboradores con error */
function Avance({ progreso, isPending, isSuccess, periodo }: AvanceProps) {
  const { lotes, procesados, errores } = progreso;

  return (
    <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-muted-foreground">
        {isPending && "Calculando… "}
        {isSuccess && "Listo. "}
        {lotes} {lotes === 1 ? "lote" : "lotes"} · {procesados}{" "}
        {procesados === 1 ? "procesado" : "procesados"} ·{" "}
        <span className={cn(errores.length > 0 && TONE_TEXT.danger)}>
          {errores.length} {errores.length === 1 ? "error" : "errores"}
        </span>
      </p>

      {errores.length > 0 && (
        <ul className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3 text-sm">
          {errores.map(({ empleado_id, error }) => (
            <li key={empleado_id} className="flex flex-col">
              <span>{error}</span>
              <Link
                to={`${buildEmpleadoPath(empleado_id, "asistencia")}?periodo=${periodo}`}
                className="text-xs text-muted-foreground hover:underline"
              >
                Abrir la ficha del colaborador
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
