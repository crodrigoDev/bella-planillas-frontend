import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";
import {
  jornadaResolver,
  type JornadaDatos,
  type JornadaFormValues,
} from "../schemas/jornada.schema";
import type { JornadaDetalle } from "../types/jornadas.types";
import {
  getValoresIniciales,
  toFormValues,
  toJornadaDto,
} from "../utils/jornadas.utils";
import { useCrearJornada, useEditarJornada } from "./useJornadaActions";

/**
 * Lógica del formulario de jornada: valores iniciales, guardado y vuelta al listado
 *
 * @param jornada - La jornada a editar; sin ella el formulario crea una nueva
 * @returns El formulario (`methods`), el envío, si está guardando y el error del guardado
 *
 * @remarks
 * Al editar se envía la jornada completa. Al guardar bien vuelve al listado.
 * Se monta con los valores ya cargados como `defaultValues`, así que no usa `reset`.
 */
export function useJornadaForm(jornada?: JornadaDetalle) {
  const navigate = useNavigate();
  const crear = useCrearJornada();
  const editar = useEditarJornada(jornada?.id ?? "");

  const methods = useForm<JornadaFormValues, unknown, JornadaDatos>({
    resolver: jornadaResolver,
    defaultValues: jornada ? toFormValues(jornada) : getValoresIniciales(),
  });

  const onSubmit = (values: JornadaDatos) => {
    const dto = toJornadaDto(values);
    const options = {
      onSuccess: () => navigate(ROUTE_PATHS.asistencia.jornadas),
    };

    if (jornada) editar.mutate(dto, options);
    else crear.mutate(dto, options);
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    isPending: crear.isPending || editar.isPending,
    error: jornada ? editar.error : crear.error,
  };
}
