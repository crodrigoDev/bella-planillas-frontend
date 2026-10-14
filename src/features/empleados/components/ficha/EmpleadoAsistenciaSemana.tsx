import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DIAS_JORNADA, FICHA_FECHA_MOCK, MARCACIONES_COLUMNAS, RESULTADOS_ASISTENCIA } from "../../config/ficha-empleado.config";
import { addFichaDays, formatMarcacionHora, getAsistenciaSemana, getFichaSemana } from "../../utils/ficha-empleado.utils";
import { formatEmpleadoFecha } from "../../utils/empleados.utils";
import { formatMinutosNetos, getResultadoAsistenciaDia } from "../../utils/asistencia-diaria.utils";
import type { JornadaEmpleado, MarcacionEmpleado, PeriodoLaboralEmpleado, SolicitudAsistenciaAprobada } from "../../types/ficha-empleado.types";

interface EmpleadoAsistenciaSemanaProps {
  semana: string;
  jornada: JornadaEmpleado | null;
  marcaciones: MarcacionEmpleado[];
  empleado: PeriodoLaboralEmpleado;
  solicitudesAprobadas?: SolicitudAsistenciaAprobada[];
  onWeekChange: (semana: string) => void;
}

/** Conserva varias marcaciones del mismo tipo sin perder sus horarios */
function MarcacionesDiaCell({ marcaciones }: { marcaciones: MarcacionEmpleado[] }) {
  if (!marcaciones.length) return <span aria-label="Sin marcación" className="text-muted-foreground">—</span>;
  return <div className="space-y-2">{marcaciones.map((item) => <div key={item.id}><p className="font-medium tabular-nums">{formatMarcacionHora(item.fecha_hora)}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{item.metodo === "MANUAL" ? "Manual" : item.metodo}</p></div>)}</div>;
}

/** Presenta marcaciones, puntualidad y horas netas de la semana */
export default function EmpleadoAsistenciaSemana({ semana, jornada, marcaciones, empleado, solicitudesAprobadas, onWeekChange }: EmpleadoAsistenciaSemanaProps) {
  const dias = getAsistenciaSemana(semana, marcaciones);
  const fin = addFichaDays(semana, 6);
  const semanaActual = getFichaSemana(FICHA_FECHA_MOCK);
  return (
    <Card className="gap-5 py-5 shadow-none ring-border">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4 px-5">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold"><CalendarDays aria-hidden="true" className="size-4 text-primary" />Asistencia semanal</h2>
          <p role="status" className="mt-1 text-xs text-muted-foreground">{formatEmpleadoFecha(semana)} — {formatEmpleadoFecha(fin)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon-sm" aria-label="Semana anterior" onClick={() => onWeekChange(addFichaDays(semana, -7))}><ChevronLeft aria-hidden="true" /></Button>
          <Button type="button" variant="outline" size="sm" disabled={semana === semanaActual} onClick={() => onWeekChange(semanaActual)}>Semana actual</Button>
          <Button type="button" variant="outline" size="icon-sm" aria-label="Semana siguiente" onClick={() => onWeekChange(addFichaDays(semana, 7))}><ChevronRight aria-hidden="true" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5">
        <div className="overflow-hidden rounded-lg border">
          <Table className="min-w-250 text-xs">
            <TableCaption className="sr-only">Marcaciones del empleado de lunes a domingo, en hora de Perú</TableCaption>
            <TableHeader className="bg-muted/30"><TableRow>
              <TableHead scope="col" className="h-10 px-3">Día</TableHead>
              <TableHead scope="col" className="px-3">Horario previsto</TableHead>
              {MARCACIONES_COLUMNAS.map((column) => <TableHead key={column.tipo} scope="col" className="px-3">{column.label}</TableHead>)}
              <TableHead scope="col" className="px-3">Resultado</TableHead>
              <TableHead scope="col" className="px-3">Horas netas</TableHead>
              <TableHead scope="col" className="px-3">Registros</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {dias.map((dia) => {
                const horario = jornada?.horario_semanal.find((item) => item.dia === dia.dia);
                const resultado = getResultadoAsistenciaDia(dia, jornada, empleado, FICHA_FECHA_MOCK, solicitudesAprobadas);
                const estado = RESULTADOS_ASISTENCIA[resultado.estado];
                return (
                  <TableRow key={dia.fecha}>
                    <TableCell className="px-3 py-3"><p className="font-medium">{DIAS_JORNADA[dia.dia]}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{formatEmpleadoFecha(dia.fecha)}</p></TableCell>
                    <TableCell className="px-3 text-muted-foreground">{!horario ? "Sin horario asignado" : !horario.laborable ? "Descanso" : `${horario.entrada?.slice(0, 5) ?? "—"} – ${horario.salida?.slice(0, 5) ?? "—"}`}</TableCell>
                    {MARCACIONES_COLUMNAS.map((column) => <TableCell key={column.tipo} className="px-3"><MarcacionesDiaCell marcaciones={dia.marcaciones.filter((item) => item.tipo_marcacion === column.tipo)} /></TableCell>)}
                    <TableCell className="px-3">
                      <Badge variant="outline" className={estado.className}>{estado.label}</Badge>
                      {resultado.minutos_tardanza > 0 && <p className="mt-1 text-[10px] text-amber-700">{resultado.minutos_tardanza} min de retraso</p>}
                    </TableCell>
                    <TableCell className="px-3 tabular-nums">
                      {resultado.minutos_netos !== null ? <span className="font-medium">{formatMinutosNetos(resultado.minutos_netos)}</span> : dia.marcaciones.length && resultado.estado !== "PENDIENTE" && resultado.estado !== "FUERA_PERIODO" ? <div className="text-[11px] text-muted-foreground"><p>Sin calcular</p><p className="mt-0.5 text-[10px]">Marcaciones incompletas</p></div> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="px-3">
                      {dia.marcaciones.length ? <Badge variant="outline" className="border-primary/15 bg-primary/5 text-[10px] text-primary">{dia.marcaciones.length} {dia.marcaciones.length === 1 ? "marcación" : "marcaciones"}</Badge> : <span className="text-[11px] text-muted-foreground">Sin marcaciones</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {!marcaciones.length && <p role="status" className="text-xs text-muted-foreground">No hay marcaciones registradas para esta semana</p>}
        <p className="text-xs leading-relaxed text-muted-foreground">Resultados de prueba en hora de Perú · Las horas netas excluyen el almuerzo registrado. Los días futuros quedan pendientes y las marcaciones incompletas no se usan para calcular horas.</p>
      </CardContent>
    </Card>
  );
}
