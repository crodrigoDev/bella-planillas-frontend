import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { buildSolicitudPath } from "@/app/routes/path";
import { getArchivoError } from "@/lib/archivo.utils";
import { SUSTENTO_REGLAS } from "../config/solicitudes.config";
import {
  solicitudResolver,
  type SolicitudDatos,
  type SolicitudFormValues,
} from "../schemas/solicitud.schema";
import { calcularDias, toSolicitudDto } from "../utils/solicitudes.utils";
import { useCrearSolicitud } from "./useSolicitudActions";

/**
 * Lógica del formulario de solicitud: valores iniciales, días sugeridos, sustento y guardado
 *
 * @returns El formulario (`methods`), el envío, el sustento con su error, si está guardando y el error del guardado
 *
 * @remarks
 * Al cambiar las fechas se sugiere la cantidad de días (se puede corregir a
 * mano). Si queda vacía, se envía la sugerencia: el backend pone 1 cuando no
 * recibe días. Al guardar bien abre el detalle de la solicitud creada.
 */
export function useSolicitudForm() {
  const navigate = useNavigate();
  const crear = useCrearSolicitud();
  const [archivo, setArchivo] = useState<File | null>(null);
  const archivoError = getArchivoError(archivo, SUSTENTO_REGLAS);

  const methods = useForm<SolicitudFormValues, unknown, SolicitudDatos>({
    resolver: solicitudResolver,
    defaultValues: {
      empleado_id: "",
      fecha_inicio: "",
      fecha_fin: "",
      por_horas: false,
      hora_inicio: "",
      hora_fin: "",
      dias_solicitados: "",
      monto: "",
      motivo: "",
      observacion: "",
    },
  });

  // Los días se sugieren cuando cambia una de las fechas, no en cada render
  useEffect(
    () =>
      methods.subscribe({
        name: ["fecha_inicio", "fecha_fin"],
        formState: { values: true },
        callback: ({ values }) => {
          const dias = calcularDias(values.fecha_inicio, values.fecha_fin);

          methods.setValue("dias_solicitados", dias ? String(dias) : "");
        },
      }),
    [methods],
  );

  const onSubmit = (datos: SolicitudDatos) => {
    if (archivoError) return;

    crear.mutate(
      { dto: toSolicitudDto(datos), archivo },
      { onSuccess: (creada) => navigate(buildSolicitudPath(creada.id)) },
    );
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    archivo,
    setArchivo,
    archivoError,
    isPending: crear.isPending,
    error: crear.error,
  };
}
