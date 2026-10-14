import {
  ListarEmpleadosQuerySchema,
  type ListarEmpleadosQueryDto,
} from "@jyp/shared-contracts";
import type { EmpleadoListado } from "../types/empleados.types";

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

/** Une el nombre y los apellidos, incluso cuando falta alguno */
export function getEmpleadoNombre(empleado: EmpleadoListado): string {
  return (
    [empleado.nombre, empleado.apellido].filter(Boolean).join(" ") ||
    "Sin nombre registrado"
  );
}

/** Conserva el dia recibido sin desplazarlo por la zona horaria */
export function formatEmpleadoFecha(value: string | null): string {
  return value ? dateFormatter.format(new Date(value)) : "Sin fecha";
}

export function formatEmpleadoSueldo(value: string | number): string {
  return currencyFormatter.format(Number(value));
}

/** Conserva solo IDs validos al leer un filtro desde la URL */
function readCatalogoParam(
  params: URLSearchParams,
  key: "area_id" | "cargo_id" | "jornada_id",
): string | undefined {
  const result = ListarEmpleadosQuerySchema.shape[key].safeParse(
    params.get(key) ?? undefined,
  );
  return result.success ? result.data : undefined;
}

/** Lee los filtros usando las reglas y los valores por defecto del contrato */
export function getEmpleadosQuery(
  params: URLSearchParams,
): ListarEmpleadosQueryDto {
  const page = ListarEmpleadosQuerySchema.shape.page.safeParse(
    params.get("page") ?? undefined,
  );
  const limit = ListarEmpleadosQuerySchema.shape.limit.safeParse(
    params.get("limit") ?? undefined,
  );

  return {
    page: page.success ? page.data : 1,
    limit: limit.success ? limit.data : 20,
    search: params.get("search") || undefined,
    area_id: readCatalogoParam(params, "area_id"),
    cargo_id: readCatalogoParam(params, "cargo_id"),
    jornada_id: readCatalogoParam(params, "jornada_id"),
    activo: ListarEmpleadosQuerySchema.shape.activo.parse(
      params.get("activo") ?? undefined,
    ),
  };
}
