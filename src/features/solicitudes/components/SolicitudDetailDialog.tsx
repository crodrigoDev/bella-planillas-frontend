import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { moduleDate, moduleLabel } from "@/components/modules/module.utils";
import {
  formatEmpleadoFecha,
  formatEmpleadoSueldo,
} from "@/features/empleados/utils/empleados.utils";
import {
  anularSolicitudMock,
  evaluarSolicitudMock,
  getHistorialSolicitudMock,
  tomarRevisionMock,
} from "../data/solicitudes.mock";
import type { SolicitudListado } from "../types/solicitudes.types";

/** Reune el detalle, historial y dictamen en una sola ventana */
export default function SolicitudDetailDialog({
  solicitud,
  onClose,
  onUpdate,
}: {
  solicitud: SolicitudListado;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [observacion, setObservacion] = useState("");
  const [error, setError] = useState("");
  const abierto =
    solicitud.estado === "PENDIENTE" || solicitud.estado === "EN_REVISION";
  const action = (operation: () => void): void => {
    try {
      operation();
      setError("");
      setObservacion("");
      onUpdate();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "No se pudo actualizar",
      );
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {solicitud.codigo} · {moduleLabel(solicitud.tipo)}
          </DialogTitle>
          <DialogDescription>
            {solicitud.colaborador_resumen.nombre_completo} ·{" "}
            {solicitud.colaborador_resumen.area}
          </DialogDescription>
        </DialogHeader>
        <Badge variant="outline" className="w-fit">
          {moduleLabel(solicitud.estado)}
        </Badge>
        <dl className="grid gap-3 text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Documento / Cargo</dt>
            <dd className="mt-1">
              {solicitud.colaborador_resumen.documento} ·{" "}
              {solicitud.colaborador_resumen.cargo}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Registro</dt>
            <dd className="mt-1">{moduleDate(solicitud.fecha_solicitud)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Periodo solicitado</dt>
            <dd className="mt-1">
              {formatEmpleadoFecha(solicitud.fecha_inicio ?? null)} –{" "}
              {formatEmpleadoFecha(solicitud.fecha_fin ?? null)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Días / Monto</dt>
            <dd className="mt-1">
              {solicitud.dias_solicitados ?? "—"} días ·{" "}
              {solicitud.monto
                ? formatEmpleadoSueldo(solicitud.monto)
                : "Sin monto"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Motivo</dt>
            <dd className="mt-1 whitespace-pre-wrap">{solicitud.motivo}</dd>
          </div>
          {solicitud.observacion && (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Observación</dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {solicitud.observacion}
              </dd>
            </div>
          )}
        </dl>
        <Link
          className="text-xs text-primary hover:underline"
          to={`/empleados/${solicitud.empleado_id}`}
        >
          Ver ficha del empleado →
        </Link>
        {abierto && (
          <div className="space-y-3 rounded-lg border p-3">
            <Label htmlFor="dictamen" className="text-xs">
              Observación para aprobar, rechazar o anular
            </Label>
            <Textarea
              id="dictamen"
              maxLength={2000}
              value={observacion}
              onChange={(event) => setObservacion(event.target.value)}
              placeholder="Obligatoria para rechazar o anular"
            />
            <div className="flex flex-wrap gap-2">
              {solicitud.estado === "PENDIENTE" ? (
                <Button
                  size="sm"
                  onClick={() => action(() => tomarRevisionMock(solicitud.id))}
                >
                  Tomar en revisión
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      action(() =>
                        evaluarSolicitudMock(solicitud.id, {
                          estado: "APROBADA",
                          observacion,
                        }),
                      )
                    }
                  >
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      action(() =>
                        evaluarSolicitudMock(solicitud.id, {
                          estado: "RECHAZADA",
                          observacion,
                        }),
                      )
                    }
                  >
                    Rechazar
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  action(() => anularSolicitudMock(solicitud.id, observacion))
                }
              >
                Anular solicitud
              </Button>
            </div>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
          </div>
        )}
        <div className="space-y-3 border-t pt-4">
          <h3 className="text-sm font-medium">Historial</h3>
          {getHistorialSolicitudMock(solicitud.id).map((item) => (
            <div
              key={item.id}
              className="border-l-2 border-primary/20 pl-3 text-xs"
            >
              <p className="font-medium">{item.accion}</p>
              <p className="mt-1 text-muted-foreground">
                {moduleDate(item.fecha)} · {item.actor.nombre_completo}
              </p>
              <p className="mt-1">
                {moduleLabel(item.cambios.estado.nuevo)}
                {item.cambios.observacion.nuevo
                  ? ` · ${item.cambios.observacion.nuevo}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
