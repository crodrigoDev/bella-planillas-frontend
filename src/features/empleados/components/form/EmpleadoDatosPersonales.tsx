import { ContactRound, IdCard, MapPin } from "lucide-react";
import { DOCUMENTOS_MOCK } from "../../data/empleados.mock";
import { ESTADO_CIVIL_OPTIONS, SEXO_OPTIONS } from "../../config/crear-empleado.config";
import EmpleadoFormSection from "./EmpleadoFormSection";
import EmpleadoInputField from "./EmpleadoInputField";
import EmpleadoSelectField from "./EmpleadoSelectField";

/** Captura la identificacion y los datos personales que acepta el contrato */
export default function EmpleadoDatosPersonales({ editing = false }: { editing?: boolean }) {
  return (
    <div className="space-y-5">
      <EmpleadoFormSection title="Identificación y datos básicos" icon={IdCard} description="* Campos obligatorios">
        <EmpleadoSelectField name="documento_id" label="Tipo de documento" options={DOCUMENTOS_MOCK.map((item) => ({ value: item.id, label: item.nombre }))} required />
        <EmpleadoInputField name="nro_documento" emptyValue={editing ? "" : undefined} label="Número de documento" placeholder="Entre 8 y 20 caracteres" maxLength={20} required className="lg:col-span-2" />
        <EmpleadoInputField name="nombre" emptyValue={editing ? null : undefined} label="Nombres" autoComplete="given-name" maxLength={100} placeholder="Ej. Gabriel Alonso" />
        <EmpleadoInputField name="apellido" emptyValue={editing ? null : undefined} label="Apellidos" autoComplete="family-name" maxLength={100} placeholder="Ej. Vásquez Montes" className="lg:col-span-2" />
        <EmpleadoInputField name="fecha_nacimiento" emptyValue={editing ? null : undefined} label="Fecha de nacimiento" type="date" autoComplete="bday" />
        <EmpleadoSelectField name="sexo" label="Sexo" options={SEXO_OPTIONS} emptyLabel="Sin especificar" />
        <EmpleadoSelectField name="estado_civil" label="Estado civil" options={ESTADO_CIVIL_OPTIONS} />
        <EmpleadoInputField name="nacionalidad" emptyValue={editing ? "" : undefined} label="Nacionalidad" maxLength={50} />
        <p className="text-xs leading-relaxed text-muted-foreground sm:col-span-2 lg:col-span-3">
          Escribe todos los apellidos en un solo campo. Puedes completar los nombres manualmente.
        </p>
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Información de contacto" icon={ContactRound} description="Opcional">
        <EmpleadoInputField name="email" emptyValue={editing ? null : undefined} label="Correo electrónico" type="email" autoComplete="email" maxLength={150} placeholder="nombre@correo.com" className="lg:col-span-2" />
        <EmpleadoInputField name="telefono" emptyValue={editing ? null : undefined} label="Teléfono" type="tel" autoComplete="tel" maxLength={20} placeholder="Ej. 987654321" />
      </EmpleadoFormSection>
      <EmpleadoFormSection title="Domicilio" icon={MapPin} description="Opcional">
        <EmpleadoInputField name="direccion" emptyValue={editing ? null : undefined} label="Dirección" autoComplete="street-address" maxLength={255} placeholder="Avenida, calle, número o departamento" className="sm:col-span-2 lg:col-span-3" />
        <EmpleadoInputField name="referencia_direccion" emptyValue={editing ? null : undefined} label="Referencia de dirección" maxLength={255} className="sm:col-span-2 lg:col-span-3" />
        <EmpleadoInputField name="departamento" emptyValue={editing ? null : undefined} label="Departamento" autoComplete="address-level1" maxLength={100} />
        <EmpleadoInputField name="provincia" emptyValue={editing ? null : undefined} label="Provincia" autoComplete="address-level2" maxLength={100} />
        <EmpleadoInputField name="distrito" emptyValue={editing ? null : undefined} label="Distrito" autoComplete="address-level3" maxLength={100} />
        <EmpleadoInputField name="ubigeo" emptyValue={editing ? null : undefined} label="Código de ubigeo" maxLength={6} placeholder="Ej. 150101" />
      </EmpleadoFormSection>
    </div>
  );
}
