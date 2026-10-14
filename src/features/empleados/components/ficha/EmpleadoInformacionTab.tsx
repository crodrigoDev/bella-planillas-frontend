import { Banknote, BriefcaseBusiness, ContactRound, IdCard } from "lucide-react";
import { DOCUMENTOS_MOCK } from "../../data/empleados.mock";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "../../config/crear-empleado.config";
import { REGIMENES_SALUD } from "../../config/empleados.config";
import { formatEmpleadoFecha, formatEmpleadoSueldo } from "../../utils/empleados.utils";
import type { EmpleadoMock } from "../../types/empleados.types";
import FichaInformacionSection from "./FichaInformacionSection";

/** Organiza los datos personales, laborales y financieros disponibles */
export default function EmpleadoInformacionTab({ empleado }: { empleado: EmpleadoMock }) {
  const financiero = empleado.dato_financiero;
  return (
    <div className="grid items-start gap-5 xl:grid-cols-2">
      <FichaInformacionSection title="Datos personales" icon={IdCard} items={[
        { label: "Tipo de documento", value: DOCUMENTOS_MOCK.find((item) => item.id === empleado.documento_id)?.nombre },
        { label: "Número de documento", value: empleado.nro_documento },
        { label: "Nombres", value: empleado.nombre },
        { label: "Apellidos", value: empleado.apellido },
        { label: "Fecha de nacimiento", value: empleado.fecha_nacimiento ? formatEmpleadoFecha(empleado.fecha_nacimiento) : null },
        { label: "Sexo", value: SEXO_OPTIONS.find((item) => item.value === empleado.sexo)?.label },
        { label: "Estado civil", value: ESTADO_CIVIL_OPTIONS.find((item) => item.value === empleado.estado_civil)?.label },
        { label: "Nacionalidad", value: empleado.nacionalidad },
      ]} />
      <FichaInformacionSection title="Contacto y domicilio" icon={ContactRound} items={[
        { label: "Correo electrónico", value: empleado.email },
        { label: "Teléfono", value: empleado.telefono },
        { label: "Dirección", value: empleado.direccion },
        { label: "Referencia", value: empleado.referencia_direccion },
        { label: "Departamento", value: empleado.departamento },
        { label: "Provincia", value: empleado.provincia },
        { label: "Distrito", value: empleado.distrito },
        { label: "Ubigeo", value: empleado.ubigeo },
      ]} />
      <FichaInformacionSection title="Datos laborales" icon={BriefcaseBusiness} items={[
        { label: "Área", value: empleado.area.nombre },
        { label: "Cargo", value: empleado.cargo.nombre },
        { label: "Fecha de ingreso", value: empleado.fecha_inicio ? formatEmpleadoFecha(empleado.fecha_inicio) : null },
        { label: "Fecha de cese", value: empleado.fecha_cese ? formatEmpleadoFecha(empleado.fecha_cese) : null },
        { label: "Jornada asignada", value: empleado.jornada?.nombre ?? "Sin jornada asignada" },
        { label: "Asignación familiar", value: empleado.asig_familiar === undefined ? null : empleado.asig_familiar ? "Sí" : "No" },
      ]} />
      <FichaInformacionSection title="Remuneración y salud" icon={Banknote} items={[
        { label: "Sueldo básico", value: financiero ? formatEmpleadoSueldo(financiero.sueldo_basico) : null },
        { label: "Régimen de salud", value: financiero ? (REGIMENES_SALUD[financiero.regimen_salud] ?? financiero.regimen_salud) : null },
        { label: "Fecha de afiliación a AFP", value: empleado.afp_fecha_filiacion ? formatEmpleadoFecha(empleado.afp_fecha_filiacion) : null },
      ]} />
    </div>
  );
}
