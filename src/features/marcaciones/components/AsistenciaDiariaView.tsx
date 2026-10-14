import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModuleSearch from "@/components/modules/ModuleSearch";
import ModuleSelect from "@/components/modules/ModuleSelect";
import {
  AREAS_MOCK,
  JORNADAS_MOCK,
} from "@/features/empleados/data/empleados.mock";
import { FICHA_FECHA_MOCK } from "@/features/empleados/config/ficha-empleado.config";
import { getEmpleadoNombre } from "@/features/empleados/utils/empleados.utils";
import type { MarcacionEmpleado } from "@/features/empleados/types/ficha-empleado.types";
import {
  ESTADOS_ASISTENCIA_DIARIA,
  RESUMEN_ASISTENCIA,
} from "../config/asistencia-diaria.config";
import { getAsistenciasDiarias } from "../utils/asistencia-diaria.utils";
import type { AsistenciaRegistro } from "../types/asistencia-diaria.types";
import AsistenciaDiariaTable from "./AsistenciaDiariaTable";
import AsistenciaDetalleDialog from "./AsistenciaDetalleDialog";

const defaultFilters = {
  modo: "dia",
  inicio: FICHA_FECHA_MOCK,
  fin: FICHA_FECHA_MOCK,
  search: "",
  area: "todos",
  jornada: "todos",
  estado: "todos",
};

/** Filtra la asistencia y calcula el resumen sobre los dias y empleados visibles */
export default function AsistenciaDiariaView({
  marcaciones,
}: {
  marcaciones: MarcacionEmpleado[];
}) {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fin = filters.modo === "dia" ? filters.inicio : filters.fin;
  const fechasInvertidas = Boolean(
    filters.inicio && fin && filters.inicio > fin,
  );
  const rows = getAsistenciasDiarias(marcaciones, filters.inicio, fin);
  const search = filters.search.trim().toLocaleLowerCase("es");
  const filtered = rows.filter(
    (row) =>
      (filters.area === "todos" || row.empleado.area_id === filters.area) &&
      (filters.jornada === "todos" ||
        (filters.jornada === "sin_jornada"
          ? !row.empleado.jornada_id
          : row.empleado.jornada_id === filters.jornada)) &&
      (!search ||
        `${getEmpleadoNombre(row.empleado)} ${row.empleado.nro_documento}`
          .toLocaleLowerCase("es")
          .includes(search)),
  );
  const visible = filtered.filter(
    (row) =>
      filters.estado === "todos" || row.resultado.estado === filters.estado,
  );
  const selected = rows.find((row) => row.id === selectedId);
  const setFilter = (key: keyof typeof defaultFilters, value: string): void =>
    setFilters((current) => ({ ...current, [key]: value }));
  const showDetail = (row: AsistenciaRegistro): void => setSelectedId(row.id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-background p-4 shadow-sm">
        <div
          role="group"
          aria-label="Periodo de asistencia"
          className="flex h-9 items-center rounded-lg border bg-muted/50 p-1"
        >
          <Button
            type="button"
            variant="ghost"
            aria-pressed={filters.modo === "dia"}
            className="h-7 px-3 text-xs aria-pressed:bg-background aria-pressed:shadow-sm"
            onClick={() => setFilter("modo", "dia")}
          >
            Día
          </Button>
          <Button
            type="button"
            variant="ghost"
            aria-pressed={filters.modo === "rango"}
            className="h-7 px-3 text-xs aria-pressed:bg-background aria-pressed:shadow-sm"
            onClick={() =>
              setFilters((current) => ({
                ...current,
                modo: "rango",
                fin:
                  current.fin < current.inicio ? current.inicio : current.fin,
              }))
            }
          >
            Rango
          </Button>
        </div>
        <label className="space-y-1.5 text-xs">
          <span className={filters.modo === "dia" ? "sr-only" : ""}>
            {filters.modo === "dia" ? "Fecha de asistencia" : "Desde"}
          </span>
          <Input
            type="date"
            className="h-9 w-36 bg-background text-xs"
            value={filters.inicio}
            onChange={(event) => setFilter("inicio", event.target.value)}
          />
        </label>
        {filters.modo === "rango" && (
          <label className="space-y-1.5 text-xs">
            Hasta
            <Input
              type="date"
              min={filters.inicio || undefined}
              className="h-9 w-36 bg-background text-xs"
              value={filters.fin}
              onChange={(event) => setFilter("fin", event.target.value)}
            />
          </label>
        )}
        <ModuleSearch
          className="flex-1 basis-48"
          label="Buscar empleado por nombre o documento"
          placeholder="Buscar empleado..."
          value={filters.search}
          onChange={(value) => setFilter("search", value)}
        />
        <div className="w-44">
          <ModuleSelect
            inlineLabel
            label="Área"
            value={filters.area}
            onChange={(value) => setFilter("area", value)}
            items={[
              { value: "todos", label: "Todas" },
              ...AREAS_MOCK.map((item) => ({
                value: item.id,
                label: item.nombre,
              })),
            ]}
          />
        </div>
        <div className="w-44">
          <ModuleSelect
            inlineLabel
            label="Jornada"
            value={filters.jornada}
            onChange={(value) => setFilter("jornada", value)}
            items={[
              { value: "todos", label: "Todas" },
              { value: "sin_jornada", label: "Sin jornada" },
              ...JORNADAS_MOCK.map((item) => ({
                value: item.id,
                label: item.nombre,
              })),
            ]}
          />
        </div>
        <div className="w-40">
          <ModuleSelect
            inlineLabel
            label="Estado"
            value={filters.estado}
            onChange={(value) => setFilter("estado", value)}
            items={[
              { value: "todos", label: "Todos" },
              ...Object.entries(ESTADOS_ASISTENCIA_DIARIA).map(
                ([value, item]) => ({ value, label: item.label }),
              ),
            ]}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 text-xs"
          onClick={() => setFilters(defaultFilters)}
        >
          <X aria-hidden className="size-3.5" />
          Limpiar filtros
        </Button>
        {fechasInvertidas && (
          <p role="alert" className="w-full text-xs text-destructive">
            La fecha final debe ser igual o posterior a la inicial
          </p>
        )}
      </div>
      <div aria-label="Resumen de asistencia" className="flex flex-wrap gap-2">
        {RESUMEN_ASISTENCIA.map(({ estado, label }) => (
          <Button
            key={estado}
            type="button"
            variant="outline"
            aria-pressed={filters.estado === estado}
            className={`h-8 gap-2 bg-background px-3 text-xs ${filters.estado === estado ? "border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() =>
              setFilter("estado", filters.estado === estado ? "todos" : estado)
            }
          >
            <span className="font-semibold tabular-nums text-foreground">
              {filtered.filter((row) => row.resultado.estado === estado).length}
            </span>
            {label}
          </Button>
        ))}
      </div>
      <AsistenciaDiariaTable
        data={visible}
        showDate={filters.modo === "rango"}
        onDetail={showDetail}
      />
      <p className="text-xs text-muted-foreground">
        Las horas netas excluyen los descansos registrados. Los días futuros
        quedan pendientes y las marcaciones incompletas no se usan para calcular
        horas
      </p>
      {selected && (
        <AsistenciaDetalleDialog
          row={selected}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
