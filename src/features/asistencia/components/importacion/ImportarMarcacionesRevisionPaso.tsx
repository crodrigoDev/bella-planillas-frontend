import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/DataTable";
import {
  ConfirmModal,
  ConfirmModalBody,
} from "@/components/feedback/ConfirmModal";
import { ResumenCifra } from "@/components/page/ResumenCifra";
import { Button } from "@/components/ui/button";
import { usePaginacionLocal } from "@/hooks/usePaginacionLocal";
import { erroresImportacionColumns } from "../../config/marcaciones.columns";
import { MARCACIONES_MAX_ERRORES } from "../../config/marcaciones.config";
import { useImportarMarcaciones } from "../../hooks/useImportarMarcaciones";
import type {
  ImportacionMarcacionesResultado,
  ImportacionMarcacionesValidacion,
} from "../../types/marcaciones.types";
import { formatPeriodoTitulo } from "../../utils/marcaciones.utils";

interface ImportarMarcacionesRevisionPasoProps {
  /** El mismo archivo que se revisó: el backend lo vuelve a leer al importar */
  archivo: File;
  revision: ImportacionMarcacionesValidacion;
  /** Vuelve al paso 1 y descarta la revisión */
  onElegirOtro: () => void;
  /** Se llama con el resultado cuando el backend termina de importar */
  onImportado: (resultado: ImportacionMarcacionesResultado) => void;
}

/**
 * Paso 2: resumen de la revisión y confirmación de la importación
 *
 * @remarks
 * Es todo o nada: solo se puede importar si el archivo no tiene errores.
 */
export function ImportarMarcacionesRevisionPaso({
  archivo,
  revision,
  onElegirOtro,
  onImportado,
}: ImportarMarcacionesRevisionPasoProps) {
  const [confirmando, setConfirmando] = useState(false);
  const { pagination, onPaginationChange, pageItems, rowCount } =
    usePaginacionLocal(revision.errores);

  const { periodo, filas_validas, errores, confirmable } = revision;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <ResumenCifra label="Período detectado" value={formatPeriodoTitulo(periodo)} />
        <ResumenCifra
          label="Filas válidas"
          value={filas_validas}
          className="text-success"
        />
        <ResumenCifra
          label="Filas con error"
          value={
            errores.length >= MARCACIONES_MAX_ERRORES
              ? `${errores.length}+`
              : errores.length
          }
          className={errores.length > 0 ? "text-destructive" : undefined}
        />
      </div>

      {!confirmable && (
        <p role="alert" className="text-sm text-destructive">
          El archivo tiene errores y no se puede importar. Corrígelo en el
          Excel y vuelve a subirlo.
        </p>
      )}

      {rowCount > 0 && (
        <section className="space-y-2" aria-labelledby="errores-marcaciones">
          <h2 id="errores-marcaciones" className="font-medium">
            Errores encontrados
          </h2>
          {errores.length >= MARCACIONES_MAX_ERRORES && (
            <p className="text-sm text-muted-foreground">
              Se muestran como máximo {MARCACIONES_MAX_ERRORES} errores; puede
              haber más en el archivo.
            </p>
          )}
          <DataTable
            columns={erroresImportacionColumns}
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

        {confirmable && (
          <Button type="button" onClick={() => setConfirmando(true)}>
            Importar {filas_validas} marcaciones
          </Button>
        )}
      </div>

      {confirmable && (
        <ConfirmModal open={confirmando} onOpenChange={setConfirmando}>
          <ConfirmarImportacionContent
            archivo={archivo}
            revision={revision}
            onImportado={onImportado}
          />
        </ConfirmModal>
      )}
    </div>
  );
}

interface ConfirmarImportacionContentProps {
  archivo: File;
  revision: ImportacionMarcacionesValidacion;
  onImportado: (resultado: ImportacionMarcacionesResultado) => void;
}

function ConfirmarImportacionContent({
  archivo,
  revision,
  onImportado,
}: ConfirmarImportacionContentProps) {
  const mutation = useImportarMarcaciones();
  const { filas_validas, periodo } = revision;

  const handleConfirm = () => {
    mutation.mutate(archivo, { onSuccess: onImportado });
  };

  return (
    <ConfirmModalBody
      title={`Importar ${filas_validas} marcaciones`}
      description={`Se registrarán las marcaciones de ${formatPeriodoTitulo(periodo)}. Las que ya existan se omiten. Después tendrás que regenerar el resumen mensual de los empleados.`}
      confirmLabel="Importar"
      isPending={mutation.isPending}
      error={mutation.error}
      onConfirm={handleConfirm}
    />
  );
}
