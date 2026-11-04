import { StatusBadge } from "@/components/feedback/StatusBadge";
import { TONE_TEXT } from "@/components/feedback/statusTone.config";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TIPO_MARCA_LABELS } from "../config/asistencia.config";
import type { DiaAsistencia } from "../types/asistencia.types";
import { formatFechaCompleta } from "../utils/asistencia.utils";
import {
  getDecisiones,
  getEstadoDia,
  getFilaDia,
  getMarcasEnOrden,
  minutosOGuion,
} from "../utils/detalleDiario.utils";

interface DetalleDiarioFilaProps {
  dia: DiaAsistencia;
  /** Fecha de hoy como YYYY-MM-DD */
  hoy: string;
  /** Si se pueden resolver días; con el mes aprobado no se puede */
  puedeResolver: boolean;
  onResolver: (fecha: string) => void;
}

/**
 * Fila de un día del detalle mensual
 *
 * @remarks
 * Las reglas (qué se resalta, qué se puede resolver, qué decisiones se muestran)
 * están en `detalleDiario.utils.ts`; aquí solo se pinta.
 */
export function DetalleDiarioFila({
  dia,
  hoy,
  puedeResolver,
  onResolver,
}: DetalleDiarioFilaProps) {
  const estado = getEstadoDia(dia);
  const decisiones = getDecisiones(dia);
  const { sinTrabajo, conProblema, esFalta, resoluble, esFuturo, esHoy, accion } =
    getFilaDia(dia, hoy, puedeResolver);

  return (
    <TableRow
      className={cn(
        sinTrabajo && "bg-muted/30 text-muted-foreground",
        esFuturo && "text-muted-foreground",
        esFalta
          ? "bg-destructive-soft/60"
          : conProblema
            ? "bg-warning-soft/50"
            : esHoy && "bg-primary/5",
      )}
    >
      <TableCell className="font-medium whitespace-nowrap tabular-nums">
        {formatFechaCompleta(dia.fecha)}
        {esHoy && (
          <span className="ml-2 text-xs font-semibold text-primary">Hoy</span>
        )}
      </TableCell>

      <TableCell>
        <StatusBadge tone={estado.tone}>{estado.label}</StatusBadge>
      </TableCell>

      <TableCell className="text-sm whitespace-nowrap tabular-nums">
        {esFalta && !dia.marcas.length ? (
          <span className="text-destructive">Sin marcas registradas</span>
        ) : (
          <span className="inline-flex gap-1.5">
            {getMarcasEnOrden(dia).map(({ tipo, hora }) => (
              <span
                key={tipo}
                title={TIPO_MARCA_LABELS[tipo]}
                className={hora ? undefined : "text-muted-foreground"}
              >
                {hora ?? "--:--"}
              </span>
            ))}
          </span>
        )}
      </TableCell>

      <TableCell className="text-center tabular-nums">
        {dia.minutos_programados}
      </TableCell>
      <TableCell className="text-center font-medium tabular-nums">
        {dia.minutos_trabajados}
      </TableCell>
      <TableCell className="text-center tabular-nums">
        {minutosOGuion(dia.minutos_tardanza)}
      </TableCell>
      <TableCell className="text-center tabular-nums">
        {minutosOGuion(dia.minutos_extra_25 + dia.minutos_extra_35)}
      </TableCell>

      <TableCell>
        {decisiones.length ? (
          <ul className="space-y-0.5">
            {decisiones.map(({ icon: Icon, texto, tone }) => (
              <li
                key={texto}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  TONE_TEXT[tone],
                )}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                {texto}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-xs text-muted-foreground">
            {sinTrabajo ? estado.label : "--"}
          </span>
        )}
      </TableCell>

      <TableCell className="text-right">
        {resoluble && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className={cn(esFalta && "text-destructive")}
            onClick={() => onResolver(dia.fecha)}
          >
            {accion}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
