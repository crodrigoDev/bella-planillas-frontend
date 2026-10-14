import type { CrearEmpleadoFormValues } from "../types/crear-empleado.types";
import type { DefaultValues, FieldPath } from "react-hook-form";

export const CREAR_EMPLEADO_DEFAULTS: DefaultValues<CrearEmpleadoFormValues> = {
  documento_id: "",
  nro_documento: "",
  nombre: "",
  apellido: "",
  sexo: null,
  estado_civil: "SOLTERO",
  nacionalidad: "PERUANA",
  area_id: "",
  cargo_id: "",
  jornada_id: null,
  estado_laboral: "ACTIVO",
  asig_familiar: false,
  contrato: {
    tipo_modalidad: "PLAZO_FIJO",
    estado: "VIGENTE",
    contrato_origen_id: null,
  },
  financiero: {
    id_regimen: "",
    id_tipo_afp: null,
    cuspp: null,
    tipo_comision: null,
    id_banco_sueldo: null,
    tipo_cuenta_sueldo: "SUELDO",
    id_banco_cts: null,
    tipo_cuenta_cts: "AHORROS",
    regimen_salud: "ESSALUD_REGULAR",
    eps_costo_adicional: 0,
  },
};

// Cada paso valida sus campos antes de permitir continuar
export const CREAR_EMPLEADO_STEPS = [
  {
    title: "Datos personales",
    description: "Identificación y contacto",
    fields: [
      "documento_id",
      "nro_documento",
      "nombre",
      "apellido",
      "fecha_nacimiento",
      "sexo",
      "estado_civil",
      "nacionalidad",
      "email",
      "telefono",
      "direccion",
      "referencia_direccion",
      "ubigeo",
      "departamento",
      "provincia",
      "distrito",
    ],
  },
  {
    title: "Datos laborales",
    description: "Puesto y jornada",
    fields: [
      "area_id",
      "cargo_id",
      "jornada_id",
      "fecha_inicio",
      "afp_fecha_filiacion",
      "asig_familiar",
      "estado_laboral",
    ],
  },
  {
    title: "Contrato",
    description: "Modalidad y vigencia",
    fields: [
      "contrato.tipo_modalidad",
      "contrato.fecha_inicio",
      "contrato.fecha_fin",
      "contrato.observacion",
      "contrato.estado",
    ],
  },
  {
    title: "Datos financieros",
    description: "Remuneración y cuentas",
    fields: [
      "financiero.id_regimen",
      "financiero.id_tipo_afp",
      "financiero.cuspp",
      "financiero.tipo_comision",
      "financiero.sueldo_basico",
      "financiero.id_banco_sueldo",
      "financiero.tipo_cuenta_sueldo",
      "financiero.nro_cuenta_sueldo",
      "financiero.cci_sueldo",
      "financiero.id_banco_cts",
      "financiero.tipo_cuenta_cts",
      "financiero.nro_cuenta_cts",
      "financiero.cci_cts",
      "financiero.regimen_salud",
      "financiero.eps_nombre",
      "financiero.eps_plan",
      "financiero.eps_costo_adicional",
    ],
  },
  { title: "Revisión", description: "Confirmación del registro", fields: [] },
] satisfies {
  title: string;
  description: string;
  fields: FieldPath<CrearEmpleadoFormValues>[];
}[];

export const SEXO_OPTIONS = [
  { value: "MASCULINO", label: "Masculino" },
  { value: "FEMENINO", label: "Femenino" },
] satisfies { value: NonNullable<CrearEmpleadoFormValues["sexo"]>; label: string }[];

export const ESTADO_CIVIL_OPTIONS = [
  { value: "SOLTERO", label: "Soltero(a)" },
  { value: "CASADO", label: "Casado(a)" },
  { value: "CONVIVIENTE", label: "Conviviente" },
  { value: "DIVORCIADO", label: "Divorciado(a)" },
  { value: "VIUDO", label: "Viudo(a)" },
] satisfies { value: NonNullable<CrearEmpleadoFormValues["estado_civil"]>; label: string }[];

export const COMISION_AFP_OPTIONS = [
  { value: "FLUJO", label: "Flujo" },
  { value: "MIXTA", label: "Mixta" },
] satisfies { value: NonNullable<CrearEmpleadoFormValues["financiero"]["tipo_comision"]>; label: string }[];

export const TIPO_CUENTA_OPTIONS = [
  { value: "SUELDO", label: "Sueldo" },
  { value: "AHORROS", label: "Ahorros" },
  { value: "CORRIENTE", label: "Corriente" },
] satisfies { value: NonNullable<CrearEmpleadoFormValues["financiero"]["tipo_cuenta_sueldo"]>; label: string }[];

export const SALUD_OPTIONS = [
  { value: "ESSALUD_REGULAR", label: "EsSalud regular" },
  { value: "EPS", label: "EPS" },
  { value: "ESSALUD_Y_EPS", label: "EsSalud y EPS" },
  { value: "SCTR", label: "SCTR" },
] satisfies { value: NonNullable<CrearEmpleadoFormValues["financiero"]["regimen_salud"]>; label: string }[];
