import type {
  CrearEmpleadoDto,
  ListarEmpleadosQueryDto,
} from "@jyp/shared-contracts";
import type { PaginatedApiResponse } from "@/lib/api/types/api.types";

export type EmpleadosQuery = Partial<ListarEmpleadosQueryDto>;

export interface EmpleadoCatalogo {
  id: string;
  nombre: string;
}

// Reutiliza los campos comunes del contrato, que en la respuesta ya vienen completos
type DatosEmpleado = Required<
  Pick<
    CrearEmpleadoDto,
    | "nombre"
    | "apellido"
    | "nro_documento"
    | "documento_id"
    | "email"
    | "telefono"
    | "sexo"
    | "estado_civil"
    | "nacionalidad"
    | "fecha_nacimiento"
    | "direccion"
    | "referencia_direccion"
    | "ubigeo"
    | "distrito"
    | "provincia"
    | "departamento"
    | "area_id"
    | "cargo_id"
    | "jornada_id"
    | "fecha_inicio"
    | "afp_fecha_filiacion"
    | "asig_familiar"
    | "estado_laboral"
  >
>;

/** Campos del listado con fechas como texto */
export interface EmpleadoListado extends DatosEmpleado {
  id: string;
  activo: boolean;
  fecha_cese: string | null;
  deleted_at: string | null;
  area: EmpleadoCatalogo;
  cargo: EmpleadoCatalogo;
  jornada: (EmpleadoCatalogo & { turno: string }) | null;
  dato_financiero: {
    sueldo_basico: string | number;
    regimen_salud: string;
  } | null;
}

// Shared contracts todavia no exporta una respuesta para este listado
export type ListarEmpleadosResponse = PaginatedApiResponse<EmpleadoListado>;
