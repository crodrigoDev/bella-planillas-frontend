import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import { Input } from "@/components/ui/input";
import type { SelectOption } from "@/lib/types/options.types";
import type { JornadaFormValues } from "../../schemas/jornada.schema";

const NO_OPTIONS: SelectOption[] = [];

/** Desde esta cantidad de áreas aparece el buscador */
const MIN_AREAS_BUSQUEDA = 8;

interface AreasCampoProps {
  /** Áreas activas; las trae la página para no depender de otra feature */
  areas: SelectOption[] | undefined;
  isLoading: boolean;
}

/**
 * Selección de las áreas donde aplica la jornada (una o varias)
 *
 * @remarks
 * Una jornada necesita al menos un área activa. Si la jornada tiene un área
 * que ya no está activa, se muestra como "Área no disponible" para poder
 * quitarla: el backend rechaza guardar con áreas inactivas.
 */
export function AreasCampo({ areas = NO_OPTIONS, isLoading }: AreasCampoProps) {
  const { control } = useFormContext<JornadaFormValues>();
  const [busqueda, setBusqueda] = useState("");

  return (
    <FormField
      name="areas_ids"
      label="Áreas"
      required
      className="col-span-full"
      description="La jornada se podrá asignar a empleados de estas áreas."
    >
      {() => (
        <Controller
          control={control}
          name="areas_ids"
          render={({ field }) => {
            const seleccionadas = field.value ?? [];
            // Mientras las áreas cargan, no se marcan como no disponibles
            const huerfanas = isLoading
              ? []
              : seleccionadas.filter(
                  (id) => !areas.some((area) => area.value === id),
                );
            const items = [
              ...areas,
              ...huerfanas.map((id) => ({
                value: id,
                label: "Área no disponible",
              })),
            ];

            const toggle = (id: string, checked: boolean) =>
              field.onChange(
                checked
                  ? [...seleccionadas, id]
                  : seleccionadas.filter((actual) => actual !== id),
              );

            if (isLoading)
              return (
                <p className="text-sm text-muted-foreground">Cargando áreas…</p>
              );

            const texto = busqueda.trim().toLowerCase();
            const visibles = texto
              ? items.filter((item) => item.label.toLowerCase().includes(texto))
              : items;

            return (
              <div className="space-y-2">
                {items.length >= MIN_AREAS_BUSQUEDA && (
                  <Input
                    type="search"
                    value={busqueda}
                    onChange={(event) => setBusqueda(event.target.value)}
                    placeholder="Buscar área"
                    aria-label="Buscar área"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  {seleccionadas.length === 1
                    ? "1 área seleccionada"
                    : `${seleccionadas.length} áreas seleccionadas`}
                </p>
                <div
                  role="group"
                  aria-label="Áreas"
                  className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {visibles.length === 0 && (
                    <p className="col-span-full text-sm text-muted-foreground">
                      Ninguna área coincide con la búsqueda.
                    </p>
                  )}
                  {visibles.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={seleccionadas.includes(item.value)}
                        onChange={(event) =>
                          toggle(item.value, event.target.checked)
                        }
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }}
        />
      )}
    </FormField>
  );
}
