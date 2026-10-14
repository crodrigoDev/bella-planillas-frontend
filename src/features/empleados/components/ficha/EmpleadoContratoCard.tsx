import { FileText, Pencil, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ESTADOS_CONTRATO } from "../../config/ficha-empleado.config";
import { formatEmpleadoFecha } from "../../utils/empleados.utils";
import { formatContratoModalidad } from "../../utils/ficha-empleado.utils";
import type { ContratoEmpleado } from "../../types/ficha-empleado.types";
import type { ContratoActions } from "../../types/contrato-empleado.types";
import { Button } from "@/components/ui/button";

interface EmpleadoContratoCardProps extends ContratoActions {
  contrato: ContratoEmpleado;
  canManage: boolean;
}

/** Presenta las fechas, modalidad y estado de un contrato del empleado */
export default function EmpleadoContratoCard({ contrato, canManage, onEdit, onRenew, onCancel }: EmpleadoContratoCardProps) {
  const state = ESTADOS_CONTRATO[contrato.estado];
  const cercano = contrato.estado === "VIGENTE" && (contrato.alerta_vencimiento === "CRITICO" || contrato.alerta_vencimiento === "PREVENTIVO");
  return (
    <Card role="article" aria-label={`Contrato iniciado el ${formatEmpleadoFecha(contrato.fecha_inicio)}`} className="gap-5 py-5 shadow-none ring-border">
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/7 text-primary"><FileText aria-hidden="true" className="size-4" /></span>
          <div>
            <h3 className="text-sm font-semibold">{formatContratoModalidad(contrato.tipo_modalidad)}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{contrato.es_prorroga ? "Prórroga de contrato" : "Contrato inicial"}</p>
          </div>
        </div>
        <Badge variant="outline" className={state.className}>{state.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div><dt className="text-xs text-muted-foreground">Fecha de inicio</dt><dd className="mt-1 text-sm font-medium">{formatEmpleadoFecha(contrato.fecha_inicio)}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Fecha de término</dt><dd className="mt-1 text-sm font-medium">{contrato.fecha_fin ? formatEmpleadoFecha(contrato.fecha_fin) : "Sin fecha de término"}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Documento</dt><dd className="mt-1 text-sm">{contrato.tiene_archivo ? "Archivo adjunto" : "Sin archivo adjunto"}</dd></div>
        </dl>
        {cercano && <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">Vence en {contrato.dias_restantes} días</p>}
        {contrato.observacion && <p className="border-t pt-3 text-xs leading-relaxed text-muted-foreground">{contrato.observacion}</p>}
        {canManage && <div className="flex flex-wrap gap-2 border-t pt-3">
          <Button type="button" variant="outline" size="sm" disabled={contrato.tiene_archivo} title={contrato.tiene_archivo ? "El contrato tiene un PDF adjunto y no se puede editar" : undefined} onClick={() => onEdit(contrato)}><Pencil aria-hidden="true" />Editar</Button>
          <Button type="button" variant="outline" size="sm" disabled={contrato.estado === "RENOVADO"} onClick={() => onRenew(contrato)}><RefreshCw aria-hidden="true" />Renovar</Button>
          <Button type="button" variant="ghost" size="sm" disabled={contrato.estado === "ANULADO"} className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onCancel(contrato)}><X aria-hidden="true" />Anular</Button>
        </div>}
      </CardContent>
    </Card>
  );
}
