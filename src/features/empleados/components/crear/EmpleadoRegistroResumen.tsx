import { Banknote, ClipboardCheck, FileText, UserRound } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { AREAS_MOCK, CARGOS_MOCK, DOCUMENTOS_MOCK, JORNADAS_MOCK } from "../../data/empleados.mock";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "../../config/crear-empleado.config";
import { REGIMENES_SALUD } from "../../config/empleados.config";
import { AFPS_MOCK, BANCOS_MOCK, REGIMENES_PENSION_MOCK } from "../../data/registro-empleado.mock";
import { formatEmpleadoFecha, formatEmpleadoSueldo } from "../../utils/empleados.utils";
import type { CrearEmpleadoFormValues } from "../../types/crear-empleado.types";
import EmpleadoFormSection from "../form/EmpleadoFormSection";

/** Presenta un dato de la revision y señala cuando se dejo vacio */
function ResumenDato({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0 space-y-1 text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="wrap-break-word font-medium text-foreground">{value?.trim() || "Sin especificar"}</dd>
    </div>
  );
}

/** Permite revisar todos los datos antes de confirmar el registro */
export default function EmpleadoRegistroResumen() {
  const { control } = useFormContext<CrearEmpleadoFormValues>();
  const values = useWatch({ control });
  const personales: [string, string | null | undefined][] = [
    ["Tipo de documento", DOCUMENTOS_MOCK.find((item) => item.id === values.documento_id)?.nombre],
    ["Número de documento", values.nro_documento],
    ["Nombres", values.nombre],
    ["Apellidos", values.apellido],
    ["Fecha de nacimiento", values.fecha_nacimiento ? formatEmpleadoFecha(values.fecha_nacimiento) : undefined],
    ["Sexo", SEXO_OPTIONS.find((item) => item.value === values.sexo)?.label],
    ["Estado civil", ESTADO_CIVIL_OPTIONS.find((item) => item.value === values.estado_civil)?.label],
    ["Nacionalidad", values.nacionalidad],
    ["Correo electrónico", values.email],
    ["Teléfono", values.telefono],
    ["Dirección", values.direccion],
    ["Referencia de dirección", values.referencia_direccion],
    ["Departamento", values.departamento],
    ["Provincia", values.provincia],
    ["Distrito", values.distrito],
    ["Código de ubigeo", values.ubigeo],
  ];
  const laborales: [string, string | null | undefined][] = [
    ["Área", AREAS_MOCK.find((item) => item.id === values.area_id)?.nombre],
    ["Cargo", CARGOS_MOCK.find((item) => item.id === values.cargo_id)?.nombre],
    ["Jornada", JORNADAS_MOCK.find((item) => item.id === values.jornada_id)?.nombre ?? "Sin jornada asignada"],
    ["Fecha de ingreso", values.fecha_inicio ? formatEmpleadoFecha(values.fecha_inicio) : undefined],
    ["Fecha de afiliación a AFP", values.afp_fecha_filiacion ? formatEmpleadoFecha(values.afp_fecha_filiacion) : undefined],
    ["Asignación familiar", values.asig_familiar ? "Sí" : "No"],
    ["Estado inicial", "Activo"],
  ];
  const contrato = values.contrato;
  const financiero = values.financiero;
  const datosContrato: [string, string | null | undefined][] = [
    ["Modalidad", contrato?.tipo_modalidad ?? "PLAZO_FIJO"],
    ["Inicio del contrato", contrato?.fecha_inicio ? formatEmpleadoFecha(contrato.fecha_inicio) : undefined],
    ["Fin del contrato", contrato?.fecha_fin ? formatEmpleadoFecha(contrato.fecha_fin) : "Sin fecha de término"],
    ["Observaciones", contrato?.observacion],
    ["Estado del contrato", "Vigente"],
  ];
  const datosFinancieros: [string, string | null | undefined][] = [
    ["Sueldo básico", financiero?.sueldo_basico != null ? formatEmpleadoSueldo(financiero.sueldo_basico) : undefined],
    ["Régimen de pensión", REGIMENES_PENSION_MOCK.find((item) => item.id === financiero?.id_regimen)?.nombre],
    ["AFP", AFPS_MOCK.find((item) => item.id === financiero?.id_tipo_afp)?.nombre],
    ["CUSPP", financiero?.cuspp?.toUpperCase()],
    ["Comisión AFP", financiero?.tipo_comision],
    ["Banco de sueldo", BANCOS_MOCK.find((item) => item.id === financiero?.id_banco_sueldo)?.nombre],
    ["Tipo de cuenta de sueldo", financiero?.tipo_cuenta_sueldo],
    ["Cuenta de sueldo", financiero?.nro_cuenta_sueldo],
    ["CCI de sueldo", financiero?.cci_sueldo],
    ["Banco de CTS", BANCOS_MOCK.find((item) => item.id === financiero?.id_banco_cts)?.nombre],
    ["Tipo de cuenta de CTS", financiero?.tipo_cuenta_cts],
    ["Cuenta de CTS", financiero?.nro_cuenta_cts],
    ["CCI de CTS", financiero?.cci_cts],
    ["Régimen de salud", financiero?.regimen_salud ? REGIMENES_SALUD[financiero.regimen_salud] : undefined],
    ["Nombre de EPS", financiero?.eps_nombre],
    ["Plan de EPS", financiero?.eps_plan],
    ["Costo adicional de EPS", financiero?.eps_costo_adicional != null ? formatEmpleadoSueldo(financiero.eps_costo_adicional) : undefined],
  ];

  return (
    <div className="space-y-5">
      <EmpleadoFormSection title="Datos personales" icon={UserRound}>
        <dl className="col-span-full grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {personales.map(([label, value]) => <ResumenDato key={label} label={label} value={value} />)}
        </dl>
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Datos laborales" icon={ClipboardCheck}>
        <dl className="col-span-full grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {laborales.map(([label, value]) => <ResumenDato key={label} label={label} value={value} />)}
        </dl>
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Contrato" icon={FileText}>
        <dl className="col-span-full grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {datosContrato.map(([label, value]) => <ResumenDato key={label} label={label} value={value} />)}
        </dl>
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Datos financieros" icon={Banknote}>
        <dl className="col-span-full grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {datosFinancieros.map(([label, value]) => <ResumenDato key={label} label={label} value={value} />)}
        </dl>
      </EmpleadoFormSection>
    </div>
  );
}
