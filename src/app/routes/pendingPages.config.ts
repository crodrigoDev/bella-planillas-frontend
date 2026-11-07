import { ROUTE_PATHS } from "./path";

/**
 * Define las rutas que muestran temporalmente la página de construcción
 */
export const pendingPages = [
  { path: ROUTE_PATHS.organizacion.areas, title: "Áreas" },
  { path: ROUTE_PATHS.organizacion.cargos, title: "Cargos" },
] as const;
