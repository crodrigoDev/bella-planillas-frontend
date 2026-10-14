import type { CrearJornadaDto } from "@jyp/shared-contracts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moduleLabel } from "@/components/modules/module.utils";
import { AREAS_MOCK } from "@/features/empleados/data/empleados.mock";

/** Revisa los datos que se guardaran antes de confirmar la jornada */
export default function JornadaSummary({
  values,
}: {
  values: CrearJornadaDto;
}) {
  const total = values.horario_semanal.reduce(
    (sum, dia) => sum + dia.total_horas,
    0,
  );
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Resumen de la jornada</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Confirma los datos y el horario antes de guardar
        </p>
      </div>
      <dl className="grid gap-4 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Nombre</dt>
          <dd className="mt-1 font-medium">{values.nombre}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Duración / Horas semanales</dt>
          <dd className="mt-1">
            {moduleLabel(values.duracion)} · {total} h
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Modalidad / Turno</dt>
          <dd className="mt-1">
            {moduleLabel(values.modalidad)} · {moduleLabel(values.turno)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tolerancia / Estado</dt>
          <dd className="mt-1">
            {values.tolerancia_minutos} min ·{" "}
            {values.activo ? "Activa" : "Inactiva"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-muted-foreground">Descripción</dt>
          <dd className="mt-1">{values.descripcion || "Sin descripción"}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-2">
        {AREAS_MOCK.filter((area) => values.areas_ids.includes(area.id)).map(
          (area) => (
            <Badge key={area.id} variant="outline">
              {area.nombre}
            </Badge>
          ),
        )}
      </div>
      {values.patron_rotacion && (
        <div className="rounded-lg border bg-primary/[0.02] p-4 text-xs">
          <p className="font-medium">
            Rotación {values.patron_rotacion.tipo_ciclo}
          </p>
          <p className="mt-2 text-muted-foreground">
            {values.patron_rotacion.dias_trabajo} días de trabajo ·{" "}
            {values.patron_rotacion.dias_descanso} de descanso · Cambio{" "}
            {moduleLabel(values.patron_rotacion.frecuencia_cambio)}
          </p>
          <p className="mt-1">
            Turnos:{" "}
            {values.patron_rotacion.turnos_base.map(moduleLabel).join(", ")}
          </p>
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Día</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Descanso</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Horas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.horario_semanal.map((dia) => (
              <TableRow key={dia.dia}>
                <TableCell className="text-xs font-medium">
                  {moduleLabel(dia.dia)}
                </TableCell>
                {dia.laborable ? (
                  <>
                    <TableCell>{dia.entrada ?? "—"}</TableCell>
                    <TableCell>
                      {dia.inicio_descanso ?? "—"} – {dia.fin_descanso ?? "—"}
                    </TableCell>
                    <TableCell>{dia.salida ?? "—"}</TableCell>
                    <TableCell>{dia.total_horas} h</TableCell>
                  </>
                ) : (
                  <TableCell
                    colSpan={4}
                    className="text-xs text-muted-foreground"
                  >
                    Día de descanso
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
