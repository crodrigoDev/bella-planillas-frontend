import { useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type DefaultValues,
} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { LoadingButton } from "@/components/form/LoadingButton";
import { StepperFooter } from "@/components/stepper/StepperFooter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { zodResolverOptions } from "@/lib/zodMessages.utils";
import {
  REGIMENES_SALUD_CON_EPS,
  isRegimenAfp,
} from "../config/datosFinancieros.config";
import { useDatosFinancierosCatalogos } from "../hooks/useCatalogos";
import {
  useCrearDatosFinancieros,
  useEditarDatosFinancieros,
} from "../hooks/useDatosFinancierosActions";
import {
  createDatosFinancierosFichaSchema,
  type DatosFinancierosFichaDatos,
} from "../schemas/datosFinancierosFicha.schema";
import type { DatosFinancieros } from "../types/datosFinancieros.types";
import { ConfirmarPasswordModal } from "./ConfirmarPasswordModal";
import { DatosFinancierosCampos } from "./DatosFinancierosCampos";

const createResolver = (opciones: Parameters<typeof createDatosFinancierosFichaSchema>[0]) =>
  zodResolver(createDatosFinancierosFichaSchema(opciones), zodResolverOptions);

// Valores del formulario antes de validar: los campos con valor por defecto
// del contrato todavía son opcionales.
type FormValues = Parameters<ReturnType<typeof createResolver>>[0];

// Valores con los que empiezan los datos financieros de un empleado sin registro
const INITIAL_VALUES = {
  tipo_cuenta_sueldo: "SUELDO",
  tipo_cuenta_cts: "AHORROS",
  regimen_salud: "ESSALUD_REGULAR",
  eps_costo_adicional: 0,
} as const;

/**
 * Convierte los datos guardados en los valores iniciales del formulario
 *
 * @remarks
 * Las cuentas, CCI y CUSPP no se cargan: el backend solo los devuelve enmascarados.
 */
const toFormValues = (
  datos: DatosFinancieros | null,
): DefaultValues<FormValues> =>
  datos
    ? {
        id_regimen: datos.id_regimen,
        id_tipo_afp: datos.id_tipo_afp ?? undefined,
        tipo_comision: datos.tipo_comision ?? undefined,
        sueldo_basico: datos.sueldo_basico,
        id_banco_sueldo: datos.id_banco_sueldo ?? undefined,
        tipo_cuenta_sueldo:
          datos.tipo_cuenta_sueldo as FormValues["tipo_cuenta_sueldo"],
        id_banco_cts: datos.id_banco_cts ?? undefined,
        tipo_cuenta_cts:
          datos.tipo_cuenta_cts as FormValues["tipo_cuenta_cts"],
        regimen_salud: datos.regimen_salud as FormValues["regimen_salud"],
        eps_nombre: datos.eps_nombre ?? undefined,
        eps_plan: datos.eps_plan ?? undefined,
        eps_costo_adicional: datos.eps_costo_adicional,
      }
    : INITIAL_VALUES;

/**
 * Prepara el cambio que se envía al backend
 *
 * @remarks
 * Un campo vacío o sin enviar queda como estaba en el backend, por eso lo que
 * el usuario quitó (banco, AFP, EPS) se envía como `null`. Una cuenta o un CCI
 * vacío se omite para no tocar el que ya está guardado, salvo que se quite el banco.
 */
const toCambios = (
  values: DatosFinancierosFichaDatos,
  esAfp: boolean,
  conEps: boolean,
) => ({
  ...values,
  id_tipo_afp: esAfp ? values.id_tipo_afp : null,
  tipo_comision: esAfp ? values.tipo_comision : null,
  cuspp: esAfp ? values.cuspp : null,
  id_banco_sueldo: values.id_banco_sueldo ?? null,
  nro_cuenta_sueldo: values.id_banco_sueldo ? values.nro_cuenta_sueldo : null,
  cci_sueldo: values.id_banco_sueldo ? values.cci_sueldo : null,
  id_banco_cts: values.id_banco_cts ?? null,
  nro_cuenta_cts: values.id_banco_cts ? values.nro_cuenta_cts : null,
  cci_cts: values.id_banco_cts ? values.cci_cts : null,
  eps_nombre: conEps ? values.eps_nombre : null,
  eps_plan: conEps ? values.eps_plan : null,
  eps_costo_adicional: conEps ? values.eps_costo_adicional : 0,
});

interface DatosFinancierosFichaFormProps {
  empleadoId: string;
  /** Datos guardados; null si el empleado todavía no tiene y se registran por primera vez */
  datos: DatosFinancieros | null;
  /** A dónde se vuelve al guardar o cancelar */
  fichaPath: string;
  /** Ruta de la edición del empleado, donde se registra la fecha de filiación a la AFP */
  editarEmpleadoPath: string;
  /** El empleado tiene fecha de filiación a la AFP; sin ella el backend rechaza el régimen AFP */
  tieneFiliacionAfp: boolean;
}

/**
 * Formulario para registrar o editar los datos financieros de un empleado desde su ficha
 *
 * @remarks
 * Registrar no pide contraseña. Editar sí: al guardar se abre un modal que la
 * pide y recién entonces se envía el cambio.
 */
export function DatosFinancierosFichaForm({
  empleadoId,
  datos,
  fichaPath,
  editarEmpleadoPath,
  tieneFiliacionAfp,
}: DatosFinancierosFichaFormProps) {
  const navigate = useNavigate();
  const crear = useCrearDatosFinancieros(empleadoId);
  const editar = useEditarDatosFinancieros(empleadoId);
  const { regimenes } = useDatosFinancierosCatalogos();

  // Cambios a la espera de que el usuario confirme con su contraseña
  const [pendientes, setPendientes] = useState<ReturnType<
    typeof toCambios
  > | null>(null);

  const regimenesData = regimenes.data;
  const cusppRegistrado = Boolean(datos?.cuspp);

  const resolver = useMemo(
    () =>
      createResolver({
        esRegimenAfp: (idRegimen) => isRegimenAfp(regimenesData, idRegimen),
        cusppRegistrado,
      }),
    [regimenesData, cusppRegistrado],
  );

  const methods = useForm<FormValues, unknown, DatosFinancierosFichaDatos>({
    resolver,
    defaultValues: toFormValues(datos),
    // Los campos que se ocultan (AFP o EPS) dejan de validarse y de enviarse
    shouldUnregister: true,
  });

  const idRegimen = useWatch({ control: methods.control, name: "id_regimen" });
  const esAfp = isRegimenAfp(regimenesData, idRegimen);
  const mutation = datos ? editar : crear;

  const onSubmit = (values: DatosFinancierosFichaDatos) => {
    if (!datos) {
      crear.mutate(values, { onSuccess: () => navigate(fichaPath) });

      return;
    }

    const conEps = REGIMENES_SALUD_CON_EPS.includes(values.regimen_salud);

    setPendientes(toCambios(values, esAfp, conEps));
  };

  const handleConfirm = (password: string) => {
    if (!pendientes) return;

    editar.mutate(
      { ...pendientes, password_confirmacion: password },
      { onSuccess: () => navigate(fichaPath) },
    );
  };

  const handleModalChange = (open: boolean) => {
    if (open) return;

    setPendientes(null);
    editar.reset();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        <DatosFinancierosCampos guardados={datos} />

        {esAfp && !tieneFiliacionAfp && (
          <Alert>
            <AlertDescription>
              Este empleado no tiene fecha de filiación a la AFP, y el sistema
              la exige para el régimen AFP. Regístrala primero en{" "}
              <Link to={editarEmpleadoPath} className="font-medium underline">
                Editar empleado
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}

        {/* Al registrar, el error se muestra aquí; al editar, dentro del modal de contraseña */}
        <ErrorAlert
          error={datos ? null : crear.error}
          title="No se pudieron guardar los datos financieros"
        />

        <StepperFooter
          progressLabel={datos ? "Editando datos financieros" : "Registrando datos financieros"}
          cancelAction={
            <Button
              variant="ghost"
              nativeButton={false}
              render={<Link to={fichaPath} />}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
          }
        >
          <LoadingButton
            type="submit"
            isLoading={!datos && crear.isPending}
            loadingText="Guardando…"
            icon={SaveIcon}
          >
            {datos ? "Guardar cambios" : "Registrar datos"}
          </LoadingButton>
        </StepperFooter>
      </form>

      <ConfirmarPasswordModal
        open={pendientes !== null}
        onOpenChange={handleModalChange}
        onConfirm={handleConfirm}
        isPending={editar.isPending}
        error={editar.error}
      />
    </FormProvider>
  );
}
