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
  /** Texto que reemplaza a la tabla cuando todos los conceptos están en cero */
  vacio: string;
}

/**
 * Bloque de conceptos de una planilla (ingresos, descuentos o aportes)
 *
 * @remarks
 * Los montos llegan como texto decimal y se convierten para mostrarlos. Los
 * conceptos en cero se ocultan: si no queda ninguno, se muestra el texto de
 * `vacio` en lugar de la tabla.
 */
export function PlanillaConceptosCard({
  titulo,
  descripcion,
  conceptos,
  planilla,
  total,
  vacio,
}: PlanillaConceptosCardProps) {
  const filas = conceptos
    .map((concepto) => ({
      ...concepto,
      monto: Number(planilla[concepto.campo]),
    }))
    .filter((fila) => fila.monto !== 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {descripcion && <CardDescription>{descripcion}</CardDescription>}
      </CardHeader>

      <CardContent>
        {filas.length === 0 ? (
          <p className="text-sm text-muted-foreground">{vacio}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-0">Concepto</TableHead>
                <TableHead className="px-0 text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((fila) => (
                <TableRow key={String(fila.campo)}>
                  <TableCell className="whitespace-normal px-0">
                    {fila.label}
                  </TableCell>
                  <TableCell className="px-0 text-right tabular-nums">
                    {formatCurrency(fila.monto)}
                  </TableCell>
                </TableRow>
              ))}
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
        )}
      </CardContent>
    </Card>
  );
}
