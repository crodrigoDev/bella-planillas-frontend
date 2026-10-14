import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moduleLabel } from "@/components/modules/module.utils";
import {
  formatEmpleadoFecha,
  getEmpleadoNombre,
} from "@/features/empleados/utils/empleados.utils";
import { formatMarcacionHora } from "@/features/empleados/utils/ficha-empleado.utils";
import { formatMinutosNetos } from "@/features/empleados/utils/asistencia-diaria.utils";
import { ESTADOS_ASISTENCIA_DIARIA } from "../config/asistencia-diaria.config";
import type { AsistenciaRegistro } from "../types/asistencia-diaria.types";

/** Abre las marcaciones del dia sin perder registros repetidos ni descansos */
export default function AsistenciaDetalleDialog({
  row,
  onClose,
}: {
  row: AsistenciaRegistro;
  onClose: () => void;
}) {
  const estado = ESTADOS_ASISTENCIA_DIARIA[row.resultado.estado];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalle de asistencia</DialogTitle>
          <DialogDescription>
            {getEmpleadoNombre(row.empleado)} · {formatEmpleadoFecha(row.fecha)}{" "}
            · Hora de Perú
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/20 p-3 text-xs">
          <Badge variant="outline" className={estado.className}>
            {estado.label}
          </Badge>
          <p>
            Horas netas:{" "}
            <strong>
              {row.resultado.minutos_netos !== null
                ? formatMinutosNetos(row.resultado.minutos_netos)
                : "Sin calcular"}
            </strong>
          </p>
          {row.resultado.minutos_tardanza > 0 && (
            <p className="text-amber-700">
              {row.resultado.minutos_tardanza} min de retraso
            </p>
          )}
        </div>
        {row.marcaciones.length ? (
          <div className="overflow-hidden rounded-lg border">
            <Table className="text-xs">
              <TableCaption className="sr-only">
                Marcaciones del día seleccionado
              </TableCaption>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Tipo de marcación</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {row.marcaciones.map((marca) => (
                  <TableRow key={marca.id}>
                    <TableCell>{moduleLabel(marca.tipo_marcacion)}</TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {formatMarcacionHora(marca.fecha_hora)}
                    </TableCell>
                    <TableCell>{moduleLabel(marca.metodo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay marcaciones registradas para este día
          </p>
        )}
        {row.resultado.minutos_netos === null && row.marcaciones.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Las horas netas se muestran cuando los tramos de trabajo y descanso
            tienen sus registros completos
          </p>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
