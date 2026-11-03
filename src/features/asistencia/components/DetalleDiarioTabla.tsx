import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  ClockIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { DiaAsistencia, TipoMarca } from "../types/asistencia.types";
import {
  formatFechaCompleta,
  formatMinutos,
  humanizarCodigo,
} from "../utils/asistencia.utils";

interface DetalleDiarioTablaProps {
  dias: DiaAsistencia[];
  /** Jornada vigente del empleado, para el subtítulo */
  jornada: string;
  /** Si se pueden resolver días; con el mes aprobado no se puede */
  puedeResolver: boolean;
  onResolver: (fecha: string) => void;
}

/** Orden en que se muestran las marcaciones de un día: E, SA, EA, S */
const ORDEN_MARCAS: TipoMarca[] = [
  "ENTRADA",
  "SALIDA_ALMUERZO",
  "ENTRADA_ALMUERZO",
  "SALIDA",
];

/** Estados de un día que hay que revisar o corregir */
const ESTADOS_CON_PROBLEMA = [
  "FALTA_INJUSTIFICADA",
  "MARCACION_INCOMPLETA",
  "AUSENCIA_PENDIENTE",
  "AUSENCIA_SIN_GOCE",
  "PENDIENTE",
];

/** Minutos, o un guion si no hay */
const minutosOGuion = (minutos: number): string =>
  minutos > 0 ? formatMinutos(minutos) : "--";

/** Nombre del estado de un día: "Puntual" o "Tardanza" cuando asistió */
const getEstadoDia = (dia: DiaAsistencia): { label: string; style: string } => {
  if (dia.estado === "ASISTENCIA_REGISTRADA")
    return dia.minutos_tardanza > 0
      ? { label: "Tardanza", style: ESTADO_DIA_STYLES.PENDIENTE }
      : { label: "Puntual", style: ESTADO_DIA_STYLES.ASISTENCIA_REGISTRADA };

  return {
    label: ESTADO_DIA_LABELS[dia.estado] ?? humanizarCodigo(dia.estado),
    style: ESTADO_DIA_STYLES[dia.estado] ?? ESTADO_DIA_NEUTRO,
  };
};

interface Decision {
  icon: LucideIcon;
  texto: string;
  style: string;
}

/**
 * Qué se ve en "Alertas y decisión" de un día
 *
 * @remarks
 * Prioriza lo que hay que revisar: alertas del backend, falta, tardanza.
 * Si no hay nada que revisar, dice "OK" o el sobretiempo reconocido.
 */
const getDecisiones = (dia: DiaAsistencia): Decision[] => {
  const decisiones: Decision[] = dia.alertas.map((alerta) => ({
    icon: TriangleAlertIcon,
    texto: ALERTA_LABELS[alerta] ?? humanizarCodigo(alerta),
    style: "text-amber-700",
  }));

  if (dia.estado === "FALTA_INJUSTIFICADA")
    decisiones.push({
      icon: CircleAlertIcon,
      texto: "Falta injustificada",
      style: "text-red-600",
    });
  else if (dia.estado === "MARCACION_INCOMPLETA")
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: "Marcación incompleta",
      style: "text-amber-700",
    });

  if (dia.estado === "ASISTENCIA_REGISTRADA" && dia.minutos_tardanza > 0)
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: "Tardanza",
      style: "text-amber-700",
    });

  const extras = [
    dia.minutos_extra_25 > 0 && "25%",
    dia.minutos_extra_35 > 0 && "35%",
  ].filter(Boolean);

  if (extras.length)
    decisiones.push({
      icon: ClockIcon,
      texto: `Sobretiempo ${extras.join(" y ")}`,
      style: "text-emerald-700",
    });

  if (dia.minutos_salida_anticipada > 0)
    decisiones.push({
      icon: TriangleAlertIcon,
      texto: `Salida anticipada de ${formatMinutos(dia.minutos_salida_anticipada)}`,
      style: "text-amber-700",
    });

  if (dia.minutos_sin_goce > 0)
    decisiones.push({
      icon: CircleAlertIcon,
      texto: `Sin goce de ${formatMinutos(dia.minutos_sin_goce)}`,
      style: "text-amber-700",
    });

  if (!decisiones.length && dia.estado === "ASISTENCIA_REGISTRADA")
    decisiones.push({
      icon: CheckCircle2Icon,
      texto: "OK",
      style: "text-emerald-700",
    });

  return decisiones;
};

/** Marcaciones de un día en orden E, SA, EA, S; las que faltan se muestran vacías */
const getMarcasEnOrden = (dia: DiaAsistencia) =>
  ORDEN_MARCAS.map((tipo) => ({
    tipo,
    hora: dia.marcas.find((marca) => marca.tipo === tipo)?.hora ?? null,
  }));

/**
 * Tabla con el detalle de cada día del mes, con su estado, marcaciones, minutos y decisión
 *
 * @remarks
 * Los días con algo que revisar se resaltan. Los días futuros, los descansos y
 * los días fuera del vínculo no se pueden resolver. Todas las acciones abren el
 * mismo modal para resolver el día.
 */
export function DetalleDiarioTabla({
  dias,
  jornada,
  puedeResolver,
  onResolver,
}: DetalleDiarioTablaProps) {
  const hoy = getTodayIsoDate();

  return (
    <section aria-label="Detalle día por día" className="rounded-lg border">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <CalendarDaysIcon className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Detalle día por día</h3>
            <p className="text-xs text-muted-foreground">Jornada: {jornada}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Mostrando {dias.length} {dias.length === 1 ? "día" : "días"}
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Marcaciones (E · SA · EA · S)</TableHead>
            <TableHead className="text-center">Min. prog.</TableHead>
            <TableHead className="text-center">Min. trab.</TableHead>
            <TableHead className="text-center">Tardanza</TableHead>
            <TableHead className="text-center">Extras</TableHead>
            <TableHead>Alertas y decisión</TableHead>
            <TableHead className="w-24 text-right">
              <span className="sr-only">Acción</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dias.map((dia) => {
            const estado = getEstadoDia(dia);
            const decisiones = getDecisiones(dia);
            const sinTrabajo = ESTADOS_DIA_SIN_RESOLVER.includes(dia.estado);
            const conProblema =
              ESTADOS_CON_PROBLEMA.includes(dia.estado) ||
              dia.alertas.length > 0 ||
              (dia.estado === "ASISTENCIA_REGISTRADA" &&
                dia.minutos_tardanza > 0);
            const esFalta = dia.estado === "FALTA_INJUSTIFICADA";
            const resoluble = puedeResolver && dia.fecha <= hoy && !sinTrabajo;
            const esFuturo = dia.fecha > hoy;
            const esHoy = dia.fecha === hoy;

            return (
              <TableRow
                key={dia.fecha}
                className={cn(
                  sinTrabajo && "bg-muted/30 text-muted-foreground",
                  esFuturo && "text-muted-foreground",
                  esFalta
                    ? "bg-red-50/60"
                    : conProblema
                      ? "bg-amber-50/50"
                      : esHoy && "bg-primary/5",
                )}
              >
                <TableCell className="font-medium whitespace-nowrap tabular-nums">
                  {formatFechaCompleta(dia.fecha)}
                  {esHoy && (
                    <span className="ml-2 text-xs font-semibold text-primary">
                      Hoy
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={estado.style}>
                    {estado.label}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm whitespace-nowrap tabular-nums">
                  {esFalta && !dia.marcas.length ? (
                    <span className="text-red-600">
                      Sin marcas registradas
                    </span>
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
                      {decisiones.map(({ icon: Icon, texto, style }) => (
                        <li
                          key={texto}
                          className={cn(
                            "flex items-center gap-1.5 text-xs",
                            style,
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
                      className={cn(esFalta && "text-red-600")}
                      onClick={() => onResolver(dia.fecha)}
                    >
                      {esFalta
                        ? "Justificar"
                        : conProblema
                          ? "Resolver"
                          : "Gestionar"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
