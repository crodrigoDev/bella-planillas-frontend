import type { RegistrarDerechohabienteDto } from "@jyp/shared-contracts";

/** Vínculos posibles de un derechohabiente con el empleado */
export type Vinculo = RegistrarDerechohabienteDto["vinculo"];

/**
 * Derechohabiente tal como lo devuelve el listado por empleado del backend
 *
 * @remarks
 * No es `DerechohabienteDetalleDto` del contrato compartido: el listado no
 * trae el sexo, el estado civil, la acreditación en EsSalud ni los documentos.
 */
export interface Derechohabiente {
  id: string;
  empleado_id: string;
  nombres: string;
  apellidos: string;
  nro_documento: string;
  vinculo: Vinculo;
  fecha_nacimiento: string;
  tipo_documento: { id: string; tipo_documento: string };
  /**
   * El listado aún no lo trae (mejora DH-F3 del backend). Si falta, el
   * derechohabiente se considera activo.
   */
  activo?: boolean;
}

/** Documento de sustento de un derechohabiente (partida, constancia...) */
export interface Sustento {
  id: string;
  tipo_documento: string;
  nombre_archivo: string;
  fecha_emision: string | null;
  fecha_vencimiento: string | null;
  vigente: boolean;
}

/** Detalle de un derechohabiente: el único que trae sus sustentos */
export interface DerechohabienteConSustentos extends Derechohabiente {
  documentos: Sustento[];
}
