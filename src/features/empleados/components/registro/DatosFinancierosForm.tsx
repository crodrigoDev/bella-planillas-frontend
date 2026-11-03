import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zodResolverOptions } from "@/lib/zodMessages.utils";
import { DatosFinancierosCampos } from "@/features/datosFinancieros/components/DatosFinancierosCampos";
import { isRegimenAfp } from "@/features/datosFinancieros/config/datosFinancieros.config";
import { useDatosFinancierosCatalogos } from "@/features/datosFinancieros/hooks/useCatalogos";
import {
  createDatosFinancierosSchema,
  type DatosFinancierosDraft,
} from "../../schemas/datosFinancieros.schema";
import { useNuevoEmpleadoStore } from "../../store/nuevoEmpleado.store";
import { RegistroFooter } from "./RegistroFooter";

// Valores con los que empiezan los datos financieros de un empleado nuevo
const INITIAL_VALUES = {
  tipo_cuenta_sueldo: "SUELDO",
  tipo_cuenta_cts: "AHORROS",
  regimen_salud: "ESSALUD_REGULAR",
  eps_costo_adicional: 0,
} as const;

const createResolver = (esRegimenAfp: (idRegimen: string) => boolean) =>
  zodResolver(createDatosFinancierosSchema(esRegimenAfp), zodResolverOptions);

// Valores del formulario antes de validar: los campos con valor por defecto
// del contrato todavía son opcionales. Se indican a `useForm` de forma
// explícita para que no los deduzca de `INITIAL_VALUES`.
type DatosFinancierosFormValues = Parameters<
  ReturnType<typeof createResolver>
>[0];

/**
 * Paso 2 del registro: previsión social, sueldo, cuentas y régimen de salud
 *
 * @remarks
 * Valida con el esquema de shared contracts y guarda los datos en el
 * borrador del asistente. Los campos son los mismos de la ficha
 * (`DatosFinancierosCampos`); aquí se suma la fecha de filiación a la AFP.
 */
export function DatosFinancierosForm() {
  const datosFinancieros = useNuevoEmpleadoStore(
    (state) => state.datosFinancieros,
  );
  const saveDatosFinancieros = useNuevoEmpleadoStore(
    (state) => state.saveDatosFinancieros,
  );
  const goToStep = useNuevoEmpleadoStore((state) => state.goToStep);

  const { regimenes } = useDatosFinancierosCatalogos();

  const regimenesData = regimenes.data;

  // El esquema necesita saber qué régimen es el de las AFP, y eso lo dice el catálogo
  const resolver = useMemo(
    () =>
      createResolver((idRegimen) => isRegimenAfp(regimenesData, idRegimen)),
    [regimenesData],
  );

  const methods = useForm<
    DatosFinancierosFormValues,
    unknown,
    DatosFinancierosDraft
  >({
    resolver,
    // Si el usuario vuelve a este paso, recupera lo que ya había escrito
    defaultValues: datosFinancieros ?? INITIAL_VALUES,
    // Los campos que se ocultan (AFP o EPS) dejan de validarse y de enviarse
    shouldUnregister: true,
  });

  const onSubmit = (values: DatosFinancierosDraft) => {
    saveDatosFinancieros(values);
    goToStep(2);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <DatosFinancierosCampos incluirFiliacion />

        <RegistroFooter step={1} />
      </form>
    </FormProvider>
  );
}
