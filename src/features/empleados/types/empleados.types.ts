import type {
  CrearEmpleadoDto,
  CrearCargoDto,
  ListarEmpleadosQueryDto,
} from "@jyp/shared-contracts";

// Conserva los filtros del contrato y deja la paginacion a la tabla
export type EmpleadosQuery = Omit<ListarEmpleadosQueryDto, "page" | "limit">;

export interface EmpleadoCatalogo {
  id: string;
  nombre: string;
}

export type EmpleadoCargo = EmpleadoCatalogo & Pick<CrearCargoDto, "id_area">;

// Reutiliza los campos comunes del contrato, que en la respuesta ya vienen completos
type DatosEmpleado = Required<
  Pick<
    CrearEmpleadoDto,
    | "nombre"
    | "apellido"
    | "nro_documento"
    | "email"
    | "area_id"
    | "cargo_id"
    | "jornada_id"
    | "fecha_inicio"
    | "estado_laboral"
  >
>;

/** Campos del listado con fechas como texto */
export interface EmpleadoListado extends DatosEmpleado {
  id: string;
  activo: boolean;
  area: EmpleadoCatalogo;
  cargo: EmpleadoCatalogo;
  jornada: (EmpleadoCatalogo & { turno: string }) | null;
  dato_financiero: {
    sueldo_basico: string | number;
    regimen_salud: string;
  } | null;
}

// Añade los datos personales necesarios para editar los registros de prueba
export type EmpleadoMock = EmpleadoListado & Partial<CrearEmpleadoDto> & {
  fecha_cese?: string | null;
  deleted_at?: string | null;
};

export interface EmpleadoActions {
  onChangeState: (empleado: EmpleadoListado) => void;
  onDeactivate: (empleado: EmpleadoListado) => void;
}
