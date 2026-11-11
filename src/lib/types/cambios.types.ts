/**
 * Un campo que cambió, tal como lo calcula el backend para la auditoría
 *
 * @remarks
 * `etiqueta` es el nombre en español del campo. Si `protegido` es true (cuentas,
 * CCI, CUSPP), el backend no envía los valores: `antes` y `despues` vienen en null.
 */
export interface CambioCampo {
  campo: string;
  etiqueta: string;
  antes: unknown;
  despues: unknown;
  protegido?: boolean;
}
