import { Link } from "react-router-dom";
import { Check, CircleAlert, RefreshCw } from "lucide-react";
import { ROUTE_PATHS } from "@/app/routes/path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TrabajoImportacion } from "../../types/importar-empleados.types";

interface ImportacionResultadoProps { job: TrabajoImportacion; isProcessing: boolean; onReset: () => void }

/** Muestra el avance del trabajo y el detalle de filas que no pudieron guardarse */
export default function ImportacionResultado({ job, isProcessing, onReset }: ImportacionResultadoProps) {
  const processed = job.procesados + job.fallidos;
  const percentage = job.total_registros ? Math.round(processed / job.total_registros * 100) : 0;
  const title = isProcessing ? "Procesando importación" : job.estado === "FALLIDO" ? "No se pudieron importar las filas" : job.fallidos ? "Importación finalizada con observaciones" : "Importación completada";

  return (
    <div className="space-y-5">
      <Card className="py-6 shadow-none ring-border">
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 role="status" className="flex items-center gap-2 text-sm font-semibold">
              {isProcessing ? <Spinner aria-hidden="true" /> : job.fallidos ? <CircleAlert aria-hidden="true" className="size-5 text-amber-600" /> : <Check aria-hidden="true" className="size-5 text-emerald-600" />}
              {title}
            </h3>
            <Badge variant="outline">{job.estado}</Badge>
          </div>
          <p className="break-all text-xs text-muted-foreground">Trabajo: {job.id}</p>
          <div>
            <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>{processed} de {job.total_registros} filas atendidas</span><span>{percentage}%</span></div>
            <div role="progressbar" aria-label="Avance de la importación" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${percentage}%` }} />
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-3 text-center text-xs">
            <div><dt className="text-muted-foreground">Importadas</dt><dd className="mt-1 text-xl font-semibold text-emerald-600">{job.procesados}</dd></div>
            <div><dt className="text-muted-foreground">Fallidas</dt><dd className="mt-1 text-xl font-semibold text-destructive">{job.fallidos}</dd></div>
            <div><dt className="text-muted-foreground">Pendientes</dt><dd className="mt-1 text-xl font-semibold">{job.total_registros - processed}</dd></div>
          </dl>
        </CardContent>
      </Card>
      {job.errores_detalle.length > 0 && (
        <Card className="shadow-none ring-border">
          <CardContent className="space-y-3">
            <h3 className="text-sm font-semibold">Errores durante el procesamiento</h3>
            <Table className="text-xs"><TableHeader><TableRow><TableHead>Documento</TableHead><TableHead>Motivo</TableHead></TableRow></TableHeader><TableBody>
              {job.errores_detalle.map((error, index) => <TableRow key={`${error.Dni}-${index}`}><TableCell>{error.Dni}</TableCell><TableCell className="whitespace-normal">{error.causa}</TableCell></TableRow>)}
            </TableBody></Table>
          </CardContent>
        </Card>
      )}
      {!isProcessing && <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={onReset}><RefreshCw aria-hidden="true" /> Importar otro archivo</Button><Button render={<Link to={ROUTE_PATHS.gestionPersonal.empleados} />}>Ver empleados</Button></div>}
    </div>
  );
}
