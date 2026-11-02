/**
 * TEMPORAL: los ids salen del seed de la base de datos local; hay que volver a
 * leerlos de la tabla `regimen_pension` si se recrea la base.
 */
/** Regímenes de pensión, tal como están en la tabla `regimen_pension` */
export const REGIMENES_PENSION_MOCK: { id: string; nombre: string }[] = [
  { id: "01a19cb2-9619-7b40-9861-42740c065d3f", nombre: "ONP" },
  { id: "01a19cb2-961c-7c41-89cc-0a578f996974", nombre: "SPP" },
];
