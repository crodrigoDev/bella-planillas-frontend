/**
 * TEMPORAL: los ids salen del seed de la base de datos local; hay que volver a
 * leerlos de la tabla `regimen_pension` si se recrea la base.
 */
/** Regímenes de pensión, tal como están en la tabla `regimen_pension` */
export const REGIMENES_PENSION_MOCK: { id: string; nombre: string }[] = [
  { id: "01a17fb7-a2e1-757b-98a7-2fdbe37cc9c7", nombre: "ONP" },
  { id: "01a17fb7-a2e4-7113-910a-9284f4a0f1f6", nombre: "SPP" },
];
