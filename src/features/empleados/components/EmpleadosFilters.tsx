import { Search, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EmpleadoCatalogo,
  EmpleadosQuery,
} from "../types/empleados.types";

interface EmpleadosFiltersProps {
  query: EmpleadosQuery;
  areas: readonly EmpleadoCatalogo[];
  cargos: readonly EmpleadoCatalogo[];
  jornadas: readonly EmpleadoCatalogo[];
  onChange: (values: EmpleadosQuery) => void;
  onReset: () => void;
}

interface CatalogoFilterProps {
  label: string;
  items: readonly EmpleadoCatalogo[];
  value?: string;
  onChange: (value: string | undefined) => void;
}

/** Presenta un catalogo como filtro y permite volver a la opcion Todos */
function CatalogoFilter({
  label,
  items,
  value,
  onChange,
}: CatalogoFilterProps) {
  const options = [
    { value: "todos", label: "Todos" },
    ...items.map((item) => ({ value: item.id, label: item.nombre })),
  ];
  return (
    <Select
      items={options}
      value={value ?? "todos"}
      onValueChange={(next) =>
        onChange(next === "todos" || !next ? undefined : next)
      }
    >
      <SelectTrigger
        aria-label={`Filtrar por ${label.toLowerCase()}`}
        className="h-9 w-full min-w-0 bg-background text-xs text-slate-700 dark:text-foreground"
      >
        <span className="shrink-0">{label}:</span>
        <SelectValue className="min-w-0 truncate" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Filtra por registro, busqueda y catalogos sin consultar al servidor */
export default function EmpleadosFilters({
  query,
  areas,
  cargos,
  jornadas,
  onChange,
  onReset,
}: EmpleadosFiltersProps) {
  const states = [
    { label: "Todos", value: undefined },
    { label: "Activos", value: true },
    { label: "Inactivos", value: false },
  ];
  const hasFilters = Boolean(
    query.search ||
    query.area_id ||
    query.cargo_id ||
    query.jornada_id ||
    query.activo !== undefined,
  );

  return (
    <div className="space-y-5">
      <div
        role="group"
        aria-label="Estado del registro"
        className="flex gap-1 border-b border-slate-200/70 dark:border-border"
      >
        {states.map((state) => (
          <Button
            key={state.label}
            type="button"
            variant="ghost"
            aria-pressed={query.activo === state.value}
            onClick={() => onChange({ activo: state.value })}
            className={cn(
              "-mb-px h-auto rounded-none border-0 border-b-2 border-transparent px-3 py-3 text-sm hover:bg-transparent hover:text-primary sm:px-4",
              query.activo === state.value
                ? "border-primary font-medium text-primary"
                : "text-slate-500",
            )}
          >
            {state.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1.7fr)_1fr_1fr_1fr_auto]">
        <form
          role="search"
          aria-label="Buscar en el listado"
          onSubmit={(event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            onChange({ search: String(values.get("search") ?? "").trim() });
          }}
        >
          <InputGroup className="h-9 bg-background">
            <InputGroupAddon className="pl-2.5">
              <InputGroupButton
                type="submit"
                size="icon-xs"
                aria-label="Buscar en listado"
              >
                <Search aria-hidden="true" className="size-4 text-slate-400" />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupInput
              key={query.search ?? ""}
              type="search"
              name="search"
              aria-label="Buscar en el listado de empleados"
              placeholder="Buscar por nombre, documento o correo"
              defaultValue={query.search ?? ""}
              className="text-foreground placeholder:text-slate-400 md:text-xs"
            />
          </InputGroup>
        </form>
        <CatalogoFilter
          label="Área"
          items={areas}
          value={query.area_id}
          onChange={(area_id) => onChange({ area_id })}
        />
        <CatalogoFilter
          label="Cargo"
          items={cargos}
          value={query.cargo_id}
          onChange={(cargo_id) => onChange({ cargo_id })}
        />
        <CatalogoFilter
          label="Jornada"
          items={jornadas}
          value={query.jornada_id}
          onChange={(jornada_id) => onChange({ jornada_id })}
        />
        <Button
          type="button"
          variant="outline"
          className="h-9 bg-background text-xs text-slate-600"
          onClick={onReset}
          disabled={!hasFilters}
        >
          <X aria-hidden="true" className="size-3.5" />
          Limpiar
        </Button>
      </div>
    </div>
  );
}
