import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearEmpleadoSchema,
  type CrearEmpleadoDto,
} from "@jyp/shared-contracts";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { DatosEmpleadoCampos } from "./DatosEmpleadoCampos";
import { RegistroFooter } from "./RegistroFooter";

// Valores con los que empieza un empleado nuevo, como en el diseño
const INITIAL_VALUES = {
  nro_documento: "",
  nombre: "",
  apellido: "",
  sexo: "MASCULINO",
  estado_civil: "SOLTERO",
  nacionalidad: "PERUANA",
  fecha_nacimiento: "",
  email: "",
  telefono: "",
  direccion: "",
  referencia_direccion: "",
  departamento: "",
  provincia: "",
  distrito: "",
  ubigeo: "",
  fecha_inicio: "",
  asig_familiar: false,
} as const;

const resolver = zodResolver(CrearEmpleadoSchema, zodResolverOptions);

// Valores del formulario antes de validar: los campos con valor por defecto
// del contrato todavía son opcionales. Se indican a `useForm` de forma
// explícita para que no los deduzca de `INITIAL_VALUES`.
type DatosEmpleadoFormValues = Parameters<typeof resolver>[0];

/**
 * Paso 1 del registro: datos personales, domicilio y asignación laboral
 *
 * @remarks
 * Valida con el esquema de shared contracts y, al continuar, guarda los
 * datos en el borrador del asistente. El empleado se crea en el último paso.
 */
export function DatosEmpleadoForm() {
  const datos = useNuevoEmpleadoStore((state) => state.datos);
  const saveDatos = useNuevoEmpleadoStore((state) => state.saveDatos);
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);

  const methods = useForm<DatosEmpleadoFormValues, unknown, CrearEmpleadoDto>({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datos ?? INITIAL_VALUES,
  });
  const { handleSubmit } = methods;

  const onSubmit = (values: CrearEmpleadoDto) => {
    saveDatos(values);
    goToStep(1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <DatosEmpleadoCampos />

        <RegistroFooter step={0} />
      </form>
    </FormProvider>
  );
}
