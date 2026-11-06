import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@/components/form/FormField";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import type { EmpleadoMarcableOption } from "../../types/marcaciones.types";

/** Espera, en milisegundos, desde la última tecla antes de buscar */
const BUSQUEDA_DELAY_MS = 400;

interface ColaboradorComboboxProps {
  name: string;
  label: string;
  required?: boolean;
  /** Resultado de la búsqueda vigente; lo trae la página */
  options: EmpleadoMarcableOption[];
  isLoading?: boolean;
  /** Se llama con el texto escrito cuando se deja de teclear */
  onSearchChange: (search: string) => void;
  placeholder?: string;
  fieldClassName?: string;
}

/**
 * Selector de colaborador con búsqueda en el servidor, enlazado al formulario
 *
 * @remarks
 * No filtra en el navegador: avisa el texto escrito (con espera) y muestra lo
 * que la página le devuelve. El colaborador elegido se conserva aunque la
 * búsqueda siguiente no lo incluya. Guarda en el formulario solo su id.
 * Debe usarse dentro de un `FormProvider`.
 */
export function ColaboradorCombobox({
  name,
  label,
  required,
  options,
  isLoading = false,
  onSearchChange,
  placeholder = "Busca por nombre o documento",
  fieldClassName,
}: ColaboradorComboboxProps) {
  const { control } = useFormContext();
  const [selected, setSelected] = useState<EmpleadoMarcableOption | null>(null);
  const { run: sendSearch } = useDebouncedCallback(
    onSearchChange,
    BUSQUEDA_DELAY_MS,
  );

  // El elegido no debe desaparecer de la lista cuando cambia la búsqueda
  const items =
    selected && !options.some(({ value }) => value === selected.value)
      ? [selected, ...options]
      : options;

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      className={fieldClassName}
    >
      {(invalid) => (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Combobox
              items={items}
              filter={null}
              value={selected}
              itemToStringLabel={(item) => item.label}
              isItemEqualToValue={(item, value) => item.value === value.value}
              onValueChange={(next) => {
                setSelected(next);
                // Al vaciar se guarda "" y no undefined, para que el esquema avise
                field.onChange(next?.value ?? "");
              }}
              onInputValueChange={(text, { reason }) => {
                // Al elegir una opción el campo se rellena solo: eso no es buscar
                if (reason === "input-change" || reason === "input-clear")
                  sendSearch(text.trim());
              }}
            >
              <ComboboxInput
                id={name}
                placeholder={placeholder}
                aria-invalid={invalid}
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>
                  {isLoading
                    ? "Buscando colaboradores…"
                    : "No se encontraron colaboradores"}
                </ComboboxEmpty>
                <ComboboxList>
                  {(item: EmpleadoMarcableOption) => (
                    <ComboboxItem key={item.value} value={item}>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate">{item.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.nro_documento}
                        </span>
                      </span>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          )}
        />
      )}
    </FormField>
  );
}
