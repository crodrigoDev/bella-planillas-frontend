import { CalendarDaysIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTodayIsoDate } from "@/lib/date.utils";
import type { DiaAsistencia } from "../types/asistencia.types";
import { DetalleDiarioFila } from "./DetalleDiarioFila";

interface DetalleDiarioTablaProps {
  dias: DiaAsistencia[];
  /** Jornada vigente del empleado, para el subtítulo */
  jornada: string;
  /** Si se pueden resolver días; con el mes aprobado no se puede */
  puedeResolver: boolean;
  onResolver: (fecha: string) => void;
}

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
          {dias.map((dia) => (
            <DetalleDiarioFila
              key={dia.fecha}
              dia={dia}
              hoy={hoy}
              puedeResolver={puedeResolver}
              onResolver={onResolver}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
