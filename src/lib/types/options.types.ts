/**
 * Opción de un selector: su valor y el texto que se muestra
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Colaborador que se puede elegir en un selector con búsqueda: además del
 * nombre trae el documento, que se muestra bajo el nombre
 */
export interface ColaboradorOption extends SelectOption {
  nro_documento: string;
}
