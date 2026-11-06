import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/DataTable";
import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { erroresFilaColumns } from "../../config/cargaMasiva.columns";
import { useConfirmarCargaMasiva } from "../../hooks/useCargaMasiva";
import { usePaginacionLocal } from "@/hooks/usePaginacionLocal";
import type { CargaMasivaPreValidacion } from "../../types/cargaMasiva.types";

interface ImportarRevisionPasoProps {
  revision: CargaMasivaPreValidacion;
  /** Vuelve al paso 1 y descarta la revisión */
  onElegirOtro: () => void;
  /** Se llama con el id del trabajo cuando el backend lo acepta */
  onConfirmado: (jobId: string) => void;
}

interface ResumenCifraProps {
  label: string;
  value: number;
  className?: string;
}

function ResumenCifra({ label, value, className }: ResumenCifraProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-semibold", className)}>{value}</p>
    </div>
  );
}

/**
 * Paso 2: resumen de la revisión y confirmación de la importación
 *
 * @remarks
 * Las filas con error no se importan; se muestran para corregirlas en el archivo.
 */
export function ImportarRevisionPaso({
  revision,
  onElegirOtro,
  onConfirmado,
}: ImportarRevisionPasoProps) {
  const [confirmando, setConfirmando] = useState(false);
  const { pagination, onPaginationChange, pageItems, rowCount } =
    usePaginacionLocal(revision.errores_detalle);

  const { total_filas, filas_validas, filas_invalidas } = revision;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <ResumenCifra label="Filas en el archivo" value={total_filas} />
        <ResumenCifra
          label="Filas válidas"
          value={filas_validas}
          className="text-success"
        />
        <ResumenCifra
          label="Filas con error"
          value={filas_invalidas}
          className={filas_invalidas > 0 ? "text-destructive" : undefined}
        />
      </div>

      {rowCount > 0 && (
        <section className="space-y-2" aria-labelledby="errores-revision">
          <h2 id="errores-revision" className="font-medium">
            Errores encontrados
          </h2>
          <DataTable
            columns={erroresFilaColumns}
            data={pageItems}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={onPaginationChange}
            emptyMessage="No hay errores"
            itemLabel="errores"
          />
        </section>
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <Button type="button" variant="outline" onClick={onElegirOtro}>
          <ArrowLeftIcon data-icon="inline-start" />
          Elegir otro archivo
        </Button>

        <Button
          type="button"
          disabled={filas_validas === 0}
          onClick={() => setConfirmando(true)}
        >
          Importar {filas_validas} empleados
        </Button>
      </div>

      <ConfirmModal open={confirmando} onOpenChange={setConfirmando}>
        <ConfirmarImportacionContent
          revision={revision}
          onConfirmado={onConfirmado}
        />
      </ConfirmModal>
    </div>
  );
}

interface ConfirmarImportacionContentProps {
  revision: CargaMasivaPreValidacion;
  onConfirmado: (jobId: string) => void;
}

function ConfirmarImportacionContent({
  revision,
  onConfirmado,
}: ConfirmarImportacionContentProps) {
  const mutation = useConfirmarCargaMasiva();
  const { filas_validas, filas_invalidas } = revision;

  const handleConfirm = () => {
    mutation.mutate(revision.filas_validas_data, { onSuccess: onConfirmado });
  };

  return (
    <ConfirmModalBody
      title={`Importar ${filas_validas} empleados`}
      description={
        filas_invalidas > 0
          ? `Se importarán las ${filas_validas} filas válidas. Las ${filas_invalidas} filas con error no se importan: tendrás que corregirlas y subirlas en otro archivo.`
          : `Se registrarán ${filas_validas} empleados. El proceso continúa en segundo plano.`
      }
      confirmLabel="Importar"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
