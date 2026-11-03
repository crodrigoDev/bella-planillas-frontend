import { ClipboardCheckIcon } from "lucide-react";

import { AccionButton } from "@/components/page/AccionButton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTodayIsoDate } from "@/lib/date.utils";
import { cn } from "@/lib/utils";
import {
  ALERTA_LABELS,
  ESTADOS_DIA_SIN_RESOLVER,
  ESTADO_DIA_LABELS,
  ESTADO_DIA_NEUTRO,
  ESTADO_DIA_STYLES,
  TIPO_MARCA_LABELS,
} from "../config/asistencia.config";
import type { DiaAsistencia } from "../types/asistencia.types";
import {
  formatDia,
  formatMinutos,
  humanizarCodigo,
} from "../utils/asistencia.utils";

interface DetalleDiarioTablaProps {
  dias: DiaAsistencia[];
  /** Si se pueden resolver días; con el mes aprobado no se puede */
  puedeResolver: boolean;
  onResolver: (fecha: string) => void;
}

/** Minutos, o un guion si no hay */
const minutosOGuion = (minutos: number): string =>
  minutos > 0 ? formatMinutos(minutos) : "--";

/**
 * Tabla con el detalle de cada día del mes: estado, marcaciones, tardanza y extras
 *
 * @remarks
 * Un día con alertas muestra el motivo bajo su estado. Los días futuros, los
 * descansos y los días fuera del vínculo no se pueden resolver.
 */
export function DetalleDiarioTabla({
  dias,
  puedeResolver,
  onResolver,
}: DetalleDiarioTablaProps) {
  const hoy = getTodayIsoDate();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Día</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Marcaciones</TableHead>
            <TableHead>Tardanza</TableHead>
            <TableHead>Extras</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dias.map((dia) => {
            const extras = dia.minutos_extra_25 + dia.minutos_extra_35;
            const resoluble =
              puedeResolver &&
              dia.fecha <= hoy &&
              !ESTADOS_DIA_SIN_RESOLVER.includes(dia.estado);

            return (
              <TableRow key={dia.fecha}>
                <TableCell className="font-medium capitalize tabular-nums">
                  {formatDia(dia.fecha)}
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        ESTADO_DIA_STYLES[dia.estado] ?? ESTADO_DIA_NEUTRO,
                      )}
                    >
                      {ESTADO_DIA_LABELS[dia.estado] ??
                        humanizarCodigo(dia.estado)}
                    </Badge>
                    {dia.alertas.map((alerta) => (
                      <p key={alerta} className="text-xs text-amber-700">
                        {ALERTA_LABELS[alerta] ?? humanizarCodigo(alerta)}
                      </p>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  {dia.marcas.length ? (
                    <div className="flex flex-wrap gap-1">
                      {dia.marcas.map((marca, index) => (
                        <span
                          key={`${marca.tipo}-${marca.hora}-${index}`}
                          title={TIPO_MARCA_LABELS[marca.tipo]}
                          className="rounded bg-muted px-1.5 py-0.5 text-xs tabular-nums"
                        >
                          {marca.hora}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>

                <TableCell className="tabular-nums">
                  {minutosOGuion(dia.minutos_tardanza)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {minutosOGuion(extras)}
                </TableCell>

                <TableCell>
                  {resoluble && (
                    <AccionButton
                      label="Resolver día"
                      icon={ClipboardCheckIcon}
                      onClick={() => onResolver(dia.fecha)}
                      className="text-sky-600"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
