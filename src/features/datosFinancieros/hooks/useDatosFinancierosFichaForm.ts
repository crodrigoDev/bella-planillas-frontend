import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toDateInput } from "@/lib/date.utils";
import {
  REGIMENES_SALUD_CON_EPS,
  isRegimenAfp,
} from "../config/datosFinancieros.config";
import {
  createDatosFinancierosFichaResolver,
  type DatosFinancierosFichaDatos,
  type DatosFinancierosFichaFormValues,
} from "../schemas/datosFinancierosFicha.schema";
import type { DatosFinancieros } from "../types/datosFinancieros.types";
import {
  filiacionCambio,
  toCambios,
  toFormValues,
} from "../utils/datosFinancieros.utils";
import { useDatosFinancierosCatalogos } from "./useCatalogos";
import {
  useCrearDatosFinancieros,
  useEditarDatosFinancieros,
} from "./useDatosFinancierosActions";

interface UseDatosFinancierosFichaFormParams {
  empleadoId: string;
  /** Datos guardados; null si el empleado todavía no tiene y se registran por primera vez */
  datos: DatosFinancieros | null;
  /** A dónde se vuelve al guardar */
  fichaPath: string;
  /** Fecha de filiación a la AFP que ya tiene el empleado; null si no tiene */
  afpFechaFiliacion: string | null;
  /** Guarda la fecha de filiación en el empleado; la compone la página, que conoce a `empleados` */
  guardarFiliacion: (fecha: string) => Promise<void>;
}

/**
 * Maneja el formulario de datos financieros de la ficha: registrar y editar
 *
 * @remarks
 * Registrar no pide contraseña. Editar sí: al enviar, los cambios quedan en
 * espera hasta que el usuario confirma con su contraseña en un modal. Con régimen
 * AFP, si la fecha de filiación cambió se guarda primero en el empleado (el backend
 * la exige para aceptar los datos financieros) y luego el resto.
 *
 * @returns Los métodos del formulario, el envío y el estado del modal de contraseña
 */
export function useDatosFinancierosFichaForm({
  empleadoId,
  datos,
  fichaPath,
  afpFechaFiliacion,
  guardarFiliacion,
}: UseDatosFinancierosFichaFormParams) {
  const navigate = useNavigate();
  const crear = useCrearDatosFinancieros(empleadoId);
  const editar = useEditarDatosFinancieros(empleadoId);
  const { regimenes } = useDatosFinancierosCatalogos();

  // Cambios a la espera de que el usuario confirme con su contraseña
  const [pendientes, setPendientes] = useState<{
    cambios: ReturnType<typeof toCambios>;
    guardarFiliacion?: () => Promise<void>;
  } | null>(null);

  const regimenesData = regimenes.data;

  const methods = useForm<
    DatosFinancierosFichaFormValues,
    unknown,
    DatosFinancierosFichaDatos
  >({
    resolver: createDatosFinancierosFichaResolver({
      esRegimenAfp: (idRegimen) => isRegimenAfp(regimenesData, idRegimen),
      cusppRegistrado: Boolean(datos?.cuspp),
    }),
    defaultValues: {
      ...toFormValues(datos),
      afp_fecha_filiacion: toDateInput(afpFechaFiliacion) || undefined,
    },
    // Los campos que se ocultan (AFP o EPS) dejan de validarse y de enviarse
    shouldUnregister: true,
  });

  const onSubmit = ({
    afp_fecha_filiacion,
    ...values
  }: DatosFinancierosFichaDatos) => {
    const esAfp = isRegimenAfp(regimenesData, values.id_regimen);
    const guardar = filiacionCambio(
      esAfp,
      afp_fecha_filiacion,
      toDateInput(afpFechaFiliacion),
    )
      ? () => guardarFiliacion(afp_fecha_filiacion as string)
      : undefined;

    if (!datos) {
      crear.mutate(
        { dto: values, guardarFiliacion: guardar },
        { onSuccess: () => navigate(fichaPath) },
      );

      return;
    }

    const conEps = REGIMENES_SALUD_CON_EPS.includes(values.regimen_salud);

    setPendientes({
      cambios: toCambios(values, esAfp, conEps),
      guardarFiliacion: guardar,
    });
  };

  const handleConfirm = (password: string) => {
    if (!pendientes) return;

    editar.mutate(
      {
        dto: { ...pendientes.cambios, password_confirmacion: password },
        guardarFiliacion: pendientes.guardarFiliacion,
      },
      { onSuccess: () => navigate(fichaPath) },
    );
  };

  const handleModalChange = (open: boolean) => {
    if (open) return;

    setPendientes(null);
    editar.reset();
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    crear,
    editar,
    /** La mutación que corresponde: editar si ya hay datos, crear si no */
    isSaving: (datos ? editar : crear).isPending,
    /** El modal de contraseña está abierto */
    confirmando: pendientes !== null,
    handleConfirm,
    handleModalChange,
  };
}
