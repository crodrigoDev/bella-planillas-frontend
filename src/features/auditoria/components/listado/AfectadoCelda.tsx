import type {
  AfectadoActividad,
  TipoAfectadoAuditoria,
} from "../../types/auditoria.types";

interface AfectadoCeldaProps {
  afectado: AfectadoActividad;
  onFiltrar: (tipo: TipoAfectadoAuditoria, id: string, nombre: string) => void;
}

/** Nombre del afectado y su dato corto; al pulsarlo se filtra por él (la empresa no se filtra) */
export function AfectadoCelda({ afectado, onFiltrar }: AfectadoCeldaProps) {
  const { id, tipo, nombre, detalle } = afectado;

  const contenido = (
    <>
      <span className="font-medium">{nombre}</span>
      {detalle && (
        <span className="text-xs text-muted-foreground">{detalle}</span>
      )}
    </>
  );

  if (id === null)
    return (
      <div className="flex min-w-0 max-w-56 flex-col whitespace-normal">
        {contenido}
      </div>
    );

  return (
    <button
      type="button"
      title="Filtrar por este afectado"
      className="flex min-w-0 max-w-56 flex-col text-left whitespace-normal hover:underline"
      onClick={() => onFiltrar(tipo, id, nombre)}
    >
      {contenido}
    </button>
  );
}
