import { CalendarDays, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DIAS_JORNADA, MODALIDADES_JORNADA } from "../../config/ficha-empleado.config";
import { TURNOS } from "../../config/empleados.config";
import type { JornadaEmpleado } from "../../types/ficha-empleado.types";
import FichaEmptyState from "./FichaEmptyState";

/** Muestra la jornada asignada y sus siete dias de horario */
export default function EmpleadoJornadaCard({ jornada }: { jornada: JornadaEmpleado | null }) {
  if (!jornada) return <FichaEmptyState icon={CalendarDays} title="Sin jornada asignada" description="El empleado no tiene una jornada laboral asignada" />;
  const patron = jornada.patron_rotacion;
  const frecuencia = { SEMANAL: "Semanal", QUINCENAL: "Quincenal", MENSUAL: "Mensual" };
  return (
    <Card className="gap-5 py-5 shadow-none ring-border">
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 px-5">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold"><Clock3 aria-hidden="true" className="size-4 text-primary" />{jornada.nombre}</h2>
          {jornada.descripcion && <p className="mt-1 text-xs text-muted-foreground">{jornada.descripcion}</p>}
        </div>
        <Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">{jornada.total_horas_semana} h semanales</Badge>
      </CardHeader>
      <CardContent className="space-y-5 px-5">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><dt className="text-xs text-muted-foreground">Duración</dt><dd className="mt-1 text-sm font-medium">{jornada.duracion === "TIEMPO_COMPLETO" ? "Tiempo completo" : "Tiempo parcial"}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Turno</dt><dd className="mt-1 text-sm font-medium">{TURNOS[jornada.turno]}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Modalidad</dt><dd className="mt-1 text-sm font-medium">{MODALIDADES_JORNADA[jornada.modalidad]}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Tolerancia</dt><dd className="mt-1 text-sm font-medium">{jornada.tolerancia_minutos} minutos</dd></div>
        </dl>
        {patron && (
          <div className="rounded-lg border bg-muted/30 p-3 text-xs">
            <h3 className="font-medium">Patrón de rotación · {patron.tipo_ciclo}</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">{patron.dias_trabajo} días de trabajo y {patron.dias_descanso} de descanso · Cambio {frecuencia[patron.frecuencia_cambio].toLowerCase()}</p>
            <p className="mt-1 text-muted-foreground">Turnos base: {patron.turnos_base.map((turno) => TURNOS[turno] ?? turno).join(" / ")}</p>
          </div>
        )}
        <div className="overflow-hidden rounded-lg border">
          <Table className="min-w-160 text-xs">
            <TableCaption className="sr-only">Horario semanal de la jornada asignada</TableCaption>
            <TableHeader className="bg-muted/30"><TableRow>
              {["Día", "Modalidad", "Entrada", "Inicio de descanso", "Fin de descanso", "Salida", "Horas"].map((label) => <TableHead key={label} scope="col" className="h-9 px-3 text-[11px]">{label}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {jornada.horario_semanal.map((dia) => (
                <TableRow key={dia.dia} className={!dia.laborable ? "bg-muted/20 text-muted-foreground" : undefined}>
                  <TableCell className="px-3 py-2.5 font-medium">{DIAS_JORNADA[dia.dia]}</TableCell>
                  <TableCell className="px-3">{dia.laborable ? MODALIDADES_JORNADA[dia.modalidad] : "Descanso"}</TableCell>
                  {[dia.entrada, dia.inicio_descanso, dia.fin_descanso, dia.salida].map((hora, index) => <TableCell key={index} className="px-3 tabular-nums">{dia.laborable ? hora?.slice(0, 5) ?? "—" : "—"}</TableCell>)}
                  <TableCell className="px-3 tabular-nums">{dia.total_horas} h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {patron && <p className="text-xs text-muted-foreground">Se muestra el horario base configurado para esta jornada rotativa</p>}
      </CardContent>
    </Card>
  );
}
