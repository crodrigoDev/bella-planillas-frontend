import type {
  CrearJornadaDto,
  CrearJornadaSchema,
} from "@jyp/shared-contracts";

export type JornadaFormValues = (typeof CrearJornadaSchema)["_input"];

export type JornadaListado = CrearJornadaDto & {
  id: string;
  total_horas_semana: number;
  total_empleados: number;
  total_areas: number;
  areas: { id: string; nombre: string }[];
};
