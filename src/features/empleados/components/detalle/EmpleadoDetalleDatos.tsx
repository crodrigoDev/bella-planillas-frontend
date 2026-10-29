import { FormSection } from "@/components/form/FormSection";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import {
  ESTADO_CIVIL_OPTIONS,
  SEXO_OPTIONS,
} from "../../config/empleados.config";
import { useTiposDocumento } from "../../hooks/useCatalogos";
import type { Empleado } from "../../types/empleados.types";
import { formatTurno, getNombreCompleto } from "../../utils/empleados.utils";
import { ResumenCampo } from "../registro/resumen/ResumenCampo";

interface EmpleadoDetalleDatosProps {
  empleado: Empleado;
}

// Un dato que no se registró se muestra con un guion
const orDash = (value: string | null | undefined): string => value || "--";

/**
 * Datos del empleado en la ficha: personales, contacto y domicilio, y laborales
 *
 * @remarks
 * Solo lectura. Usa los mismos bloques que el resumen del registro.
 */
export function EmpleadoDetalleDatos({ empleado }: EmpleadoDetalleDatosProps) {
  const tiposDocumento = useTiposDocumento();

  return (
    <div className="space-y-6">
      <FormSection
        title="Datos personales"
        description="Identificación y datos de identidad del colaborador."
      >
        <ResumenCampo
          label="Tipo de documento"
          value={getOptionLabel(tiposDocumento.data, empleado.documento_id)}
        />
        <ResumenCampo label="Nº de documento" value={empleado.nro_documento} />
        <ResumenCampo
          label="Nombre completo"
          value={getNombreCompleto(empleado)}
        />
        <ResumenCampo
          label="Sexo"
          value={getOptionLabel(SEXO_OPTIONS, empleado.sexo)}
        />
        <ResumenCampo
          label="Estado civil"
          value={getOptionLabel(ESTADO_CIVIL_OPTIONS, empleado.estado_civil)}
        />
        <ResumenCampo
          label="Nacionalidad"
          value={orDash(empleado.nacionalidad)}
        />
        <ResumenCampo
          label="Fecha de nacimiento"
          value={formatDate(empleado.fecha_nacimiento)}
        />
      </FormSection>

      <FormSection
        title="Contacto y domicilio"
        description="Canales de comunicación y dirección de residencia."
      >
        <ResumenCampo label="Correo electrónico" value={orDash(empleado.email)} />
        <ResumenCampo label="Teléfono" value={orDash(empleado.telefono)} />
        <ResumenCampo
          label="Dirección"
          value={orDash(empleado.direccion)}
          className="sm:col-span-2"
        />
        <ResumenCampo
          label="Referencia de ubicación"
          value={orDash(empleado.referencia_direccion)}
          className="col-span-full"
        />
        <ResumenCampo
          label="Departamento"
          value={orDash(empleado.departamento)}
        />
        <ResumenCampo label="Provincia" value={orDash(empleado.provincia)} />
        <ResumenCampo label="Distrito" value={orDash(empleado.distrito)} />
        <ResumenCampo label="Ubigeo" value={orDash(empleado.ubigeo)} />
      </FormSection>

      <FormSection
        title="Situación laboral"
        description="Posición dentro de la empresa y fechas de ingreso y cese."
      >
        <ResumenCampo label="Área" value={empleado.area.nombre} />
        <ResumenCampo label="Cargo" value={empleado.cargo.nombre} />
        <ResumenCampo
          label="Jornada"
          value={
            empleado.jornada
              ? `${empleado.jornada.nombre} (${formatTurno(empleado.jornada.turno)})`
              : "Sin jornada"
          }
        />
        <ResumenCampo
          label="Inicio de labores"
          value={formatDate(empleado.fecha_inicio)}
        />
        <ResumenCampo
          label="Fecha de cese"
          value={empleado.fecha_cese ? formatDate(empleado.fecha_cese) : "Sin fecha"}
        />
        <ResumenCampo
          label="Asignación familiar"
          value={empleado.asig_familiar ? "Sí" : "No"}
        />
      </FormSection>
    </div>
  );
}
