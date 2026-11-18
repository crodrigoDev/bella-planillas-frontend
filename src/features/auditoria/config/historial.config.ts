import {
  ArchiveIcon,
  HistoryIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";

/** Hechos que se piden por página; el backend admite hasta 100 */
export const HISTORIAL_LIMIT = 20;

/** Icono y color del círculo de cada acción en la línea de tiempo */
interface AccionEstilo {
  icon: LucideIcon;
  circulo: string;
}

/**
 * Estilo de cada acción de negocio (`accion_etiqueta`) del backend
 *
 * @remarks
 * Son las cinco acciones que el backend ofrece a RRHH.
 */
const ACCION_ESTILOS: Record<string, AccionEstilo> = {
  Creación: {
    icon: PlusIcon,
    circulo: "bg-primary text-primary-foreground",
  },
  Edición: {
    icon: PencilIcon,
    circulo: "bg-category-3 text-category-foreground",
  },
  Baja: {
    icon: ArchiveIcon,
    circulo: "bg-category-5 text-category-foreground",
  },
  Reactivación: {
    icon: RotateCcwIcon,
    circulo: "bg-category-2 text-category-foreground",
  },
  Eliminación: {
    icon: Trash2Icon,
    circulo: "bg-destructive text-category-foreground",
  },
};

/** Estilo de una acción; una desconocida se muestra con un icono neutro */
export const getAccionEstilo = (accionEtiqueta: string): AccionEstilo =>
  ACCION_ESTILOS[accionEtiqueta] ?? {
    icon: HistoryIcon,
    circulo: "bg-muted text-muted-foreground",
  };
