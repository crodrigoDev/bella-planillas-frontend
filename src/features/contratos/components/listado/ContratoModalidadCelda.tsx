import { getModalidadLabel } from "../../config/contratos.config";
import { useModalidadesContrato } from "../../hooks/useCatalogos";

interface ContratoModalidadCeldaProps {
  /** Código de la modalidad, o el texto "No especificado" que manda el backend */
  modalidad: string;
}

/**
 * Nombre de la modalidad de un contrato en el listado
 *
 * @remarks
 * Las filas comparten la consulta del catálogo. Un valor que no está en el
 * catálogo (como "No especificado") se muestra tal cual.
 */
export function ContratoModalidadCelda({
  modalidad,
}: ContratoModalidadCeldaProps) {
  const modalidades = useModalidadesContrato();

  return <span>{getModalidadLabel(modalidades.data, modalidad)}</span>;
}
