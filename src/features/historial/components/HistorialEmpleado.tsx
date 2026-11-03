import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  FILTRO_HISTORIAL_OPTIONS,
  FILTRO_TIPOS,
} from "../config/historial.config";
import type { EventoHistorial } from "../types/historial.types";
import { EventoHistorialItem } from "./EventoHistorialItem";

interface HistorialEmpleadoProps {
  /** Hechos del empleado, en cualquier orden: se muestran del más reciente al más antiguo */
  eventos: EventoHistorial[];
}

/**
 * Pestaña Historial de la ficha: línea de tiempo de lo que le pasó al empleado
 *
 * @remarks
 * Recibe los eventos ya armados. Por ahora salen de datos de ejemplo
 * (`historial.mock.ts`) hasta que el backend entregue el historial por empleado.
 */
export function HistorialEmpleado({ eventos }: HistorialEmpleadoProps) {
  const [filtro, setFiltro] = useState("TODOS");

  const tipos = FILTRO_TIPOS[filtro];
  const visibles = [...eventos]
    .filter((evento) => !tipos || tipos.includes(evento.tipo))
    // Del más reciente al más antiguo; los del mismo día conservan su orden inverso
    .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id));

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Filtrar el historial"
        className="flex flex-wrap items-center gap-2"
      >
        {FILTRO_HISTORIAL_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={filtro === value ? "default" : "outline"}
            aria-pressed={filtro === value}
            onClick={() => setFiltro(value)}
          >
            {label}
          </Button>
        ))}
        <p className="ml-auto text-sm text-muted-foreground">
          {visibles.length === 1 ? "1 hecho" : `${visibles.length} hechos`}
        </p>
      </div>

      {visibles.length ? (
        <ol className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-5 before:w-px before:bg-border">
          {visibles.map((evento) => (
            <EventoHistorialItem key={evento.id} evento={evento} />
          ))}
        </ol>
      ) : (
        <div className="space-y-1 py-12 text-center">
          <p className="font-medium">Sin hechos de este tipo</p>
          <p className="text-sm text-muted-foreground">
            Todavía no hay nada registrado en esta categoría.
          </p>
        </div>
      )}
    </div>
  );
}
