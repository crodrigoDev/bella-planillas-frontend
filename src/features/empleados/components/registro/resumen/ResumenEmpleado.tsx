import type { CrearEmpleadoDto } from "@jyp/shared-contracts";

import { FormSection } from "@/components/form/FormSection";
import { getOptionLabel } from "@/lib/catalogos.utils";
import { formatDate } from "@/lib/format.utils";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "../../../config/empleados.config";
import { useEmpleadosCatalogos, useTiposDocumento } from "../../../hooks/useCatalogos";
import { ResumenCampo } from "@/components/form/ResumenCampo";

interface ResumenEmpleadoProps {
  datos: CrearEmpleadoDto;
}

/**
 * Resumen del paso 1: datos personales, domicilio y asignación laboral
 */
export function ResumenEmpleado({ datos }: ResumenEmpleadoProps) {
  const tiposDocumento = useTiposDocumento();
  const { areas, cargos, jornadas } = useEmpleadosCatalogos(datos.area_id);

  return (
    <FormSection
      title="Datos del empleado"
      description="Identificación, domicilio y asignación laboral."
    >
      <ResumenCampo
        label="Tipo de documento"
        value={getOptionLabel(tiposDocumento.data, datos.documento_id)}
      />
      <ResumenCampo label="Nº de documento" value={datos.nro_documento} />
      <ResumenCampo label="Nombres" value={datos.nombre} />
      <ResumenCampo label="Apellidos" value={datos.apellido} />
      <ResumenCampo
        label="Sexo"
        value={getOptionLabel(SEXO_OPTIONS, datos.sexo)}
      />
      <ResumenCampo
        label="Estado civil"
        value={getOptionLabel(ESTADO_CIVIL_OPTIONS, datos.estado_civil)}
      />
      <ResumenCampo label="Nacionalidad" value={datos.nacionalidad ?? "--"} />
      <ResumenCampo
        label="Fecha de nacimiento"
        value={formatDate(datos.fecha_nacimiento)}
      />
      <ResumenCampo label="Correo electrónico" value={datos.email} />
      <ResumenCampo label="Teléfono" value={datos.telefono} />
      <ResumenCampo
        label="Dirección"
        value={datos.direccion}
        className="sm:col-span-2"
      />
      <ResumenCampo
        label="Referencia de ubicación"
        value={datos.referencia_direccion}
        className="col-span-full"
      />
      <ResumenCampo label="Departamento" value={datos.departamento} />
      <ResumenCampo label="Provincia" value={datos.provincia} />
      <ResumenCampo label="Distrito" value={datos.distrito} />
      <ResumenCampo label="Ubigeo" value={datos.ubigeo} />
      <ResumenCampo
        label="Área"
        value={getOptionLabel(areas.data, datos.area_id)}
      />
      <ResumenCampo
        label="Cargo"
        value={getOptionLabel(cargos.data, datos.cargo_id)}
      />
      <ResumenCampo
        label="Jornada"
        value={getOptionLabel(jornadas.data, datos.jornada_id)}
      />
      <ResumenCampo
        label="Inicio de labores"
        value={formatDate(datos.fecha_inicio)}
      />
      <ResumenCampo
        label="Asignación familiar"
        value={datos.asig_familiar ? "Sí" : "No"}
      />
    </FormSection>
  );
}
