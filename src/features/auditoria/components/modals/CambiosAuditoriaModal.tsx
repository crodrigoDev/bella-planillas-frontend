import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatFechaHoraLima } from "@/lib/date.utils";
import {
  getAccionLabel,
  getAccionTone,
  getTablaLabel,
} from "../../config/auditoria.config";
import { useAuditoriaRegistro } from "../../hooks/useAuditoria";
import type { AuditoriaLog } from "../../types/auditoria.types";
import {
  formatCampoAuditoria,
  formatValorAuditoria,
  getCambiosAuditoria,
  getUsuarioNombre,
} from "../../utils/auditoria.utils";

interface CambiosAuditoriaModalProps {
  /** Fila elegida; sin fila el modal está cerrado */
  log: AuditoriaLog | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal con lo que cambió en un registro auditado
 *
 * @remarks
 * El listado no trae los valores: el detalle se pide al abrir. En una creación
 * se muestran todos los campos; en una modificación, solo los que cambiaron.
 */
export function CambiosAuditoriaModal({
  log,
  onOpenChange,
}: CambiosAuditoriaModalProps) {
  return (
    <Dialog open={log !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl"
      >
        {log && (
          <CambiosContent log={log} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CambiosContentProps {
  log: AuditoriaLog;
  onClose: () => void;
}

function CambiosContent({ log, onClose }: CambiosContentProps) {
  const { data, error, isLoading, refetch } = useAuditoriaRegistro(log.id);

  const cambios = data
    ? getCambiosAuditoria(data.valores_antes, data.valores_despues)
    : [];

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex flex-wrap items-center gap-2">
          Cambios
          <StatusBadge tone={getAccionTone(log.accion)}>
            {getAccionLabel(log.accion)}
          </StatusBadge>
        </DialogTitle>
        <DialogDescription>
          {getTablaLabel(log.tabla_afectada)} · {getUsuarioNombre(log)} ·{" "}
          {formatFechaHoraLima(log.created_at)}
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <ErrorAlert
          error={error}
          title="No se pudo cargar el detalle"
          onRetry={() => refetch()}
        />
      ) : data === null ? (
        <EmptyState
          variant="dashed"
          title="Este registro de auditoría ya no existe."
        />
      ) : cambios.length === 0 ? (
        <EmptyState
          variant="dashed"
          title="No hay cambios que mostrar."
          description="Esta fila no guardó valores distintos entre antes y después."
        />
      ) : (
        <div className="max-h-96 overflow-y-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campo</TableHead>
                <TableHead>Antes</TableHead>
                <TableHead>Después</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cambios.map((cambio) => (
                <TableRow key={cambio.campo}>
                  <TableCell className="align-top font-medium whitespace-normal">
                    {formatCampoAuditoria(cambio.campo)}
                  </TableCell>
                  <TableCell className="max-w-56 align-top whitespace-normal wrap-break-word text-muted-foreground">
                    {formatValorAuditoria(cambio.anterior)}
                  </TableCell>
                  <TableCell className="max-w-56 align-top whitespace-normal wrap-break-word">
                    {formatValorAuditoria(cambio.nuevo)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </DialogFooter>
    </>
  );
}
