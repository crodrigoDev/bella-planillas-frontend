import {
  HistoryIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";

/** Título, icono y color del círculo de cada acción en la línea de tiempo */
interface AccionEstilo {
  titulo: string;
  icon: LucideIcon;
  circulo: string;
}

const CREACION: AccionEstilo = {
  titulo: "Registro creado",
  icon: PlusIcon,
  circulo: "bg-primary text-primary-foreground",
};

const MODIFICACION: AccionEstilo = {
  titulo: "Datos modificados",
  icon: PencilIcon,
  circulo: "bg-category-3 text-category-foreground",
};

const ELIMINACION: AccionEstilo = {
  titulo: "Registro eliminado",
  icon: Trash2Icon,
  circulo: "bg-destructive text-category-foreground",
};

/**
 * Estilo de cada acción que guarda la auditoría
 *
 * @remarks
 * Los triggers solo escriben `CREATE` y `UPDATE`; la capa de datos del backend
 * usa el nombre de la operación, con sus variantes masivas.
 */
const ACCION_ESTILOS: Record<string, AccionEstilo> = {
  CREATE: CREACION,
  CREATEMANY: CREACION,
  UPDATE: MODIFICACION,
  UPSERT: MODIFICACION,
  UPDATEMANY: MODIFICACION,
  DELETE: ELIMINACION,
  DELETEMANY: ELIMINACION,
};

/** Estilo de una acción; una desconocida se muestra con su nombre y un icono neutro */
export const getAccionEstilo = (accion: string): AccionEstilo =>
  ACCION_ESTILOS[accion] ?? {
    titulo: accion,
    icon: HistoryIcon,
    circulo: "bg-muted text-muted-foreground",
  };
