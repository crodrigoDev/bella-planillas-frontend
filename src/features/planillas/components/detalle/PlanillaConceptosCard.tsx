import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format.utils";
import { cn } from "@/lib/utils";
import type { ConceptoPlanilla } from "../../config/planillas.config";
import type { PlanillaDetalle } from "../../types/planillas.types";

interface PlanillaConceptosCardProps {
  titulo: string;
  descripcion?: string;
  /** Conceptos del bloque, en el orden en que se muestran */
  conceptos: readonly ConceptoPlanilla[];
  planilla: PlanillaDetalle;
  /** Total del bloque; si se indica, se muestra al pie */
  total?: string;
}

/**
 * Bloque de conceptos de una planilla (ingresos, descuentos o aportes)
 *
 * @remarks
 * Muestra todos los conceptos en el mismo orden que la boleta; los montos en
 * cero se atenúan para destacar los conceptos con importe.
 */
export function PlanillaConceptosCard({
  titulo,
  descripcion,
  conceptos,
  planilla,
  total,
}: PlanillaConceptosCardProps) {
  const filas = conceptos.map((concepto) => ({
    ...concepto,
    monto: Number(planilla[concepto.campo]),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-0">Concepto</TableHead>
              <TableHead className="px-0 text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filas.map((fila) => {
              const esCero = fila.monto === 0;

              return (
                <TableRow
                  key={String(fila.campo)}
                  className={cn(esCero && "text-muted-foreground")}
                >
                  <TableCell className="whitespace-normal px-0">
                    {fila.label}
                  </TableCell>
                  <TableCell className="px-0 text-right tabular-nums">
                    {formatCurrency(fila.monto)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          {total !== undefined && (
            <TableFooter>
              <TableRow>
                <TableCell className="px-0 font-medium">Total</TableCell>
                <TableCell className="px-0 text-right font-medium tabular-nums">
                  {formatCurrency(Number(total))}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
