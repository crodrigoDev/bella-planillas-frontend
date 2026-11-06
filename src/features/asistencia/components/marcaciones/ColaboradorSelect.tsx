import { useState } from "react";

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

interface ColaboradorSelectProps {
  /** Id del colaborador elegido */
  value: string | undefined;
  /** Se llama con el id elegido, o `undefined` al vaciar el campo */
  onChange: (value: string | undefined) => void;
  /** Resultado de la búsqueda vigente; lo trae quien lo usa */
  options: EmpleadoMarcableOption[];
  isLoading?: boolean;
  /** Se llama con el texto escrito cuando se deja de teclear */
  onSearchChange: (search: string) => void;
  /** Nombre del elegido cuando no está en `options` (por ejemplo, el id viene de la URL) */
  selectedLabel?: string;
  placeholder?: string;
  id?: string;
  ariaLabel?: string;
  invalid?: boolean;
  className?: string;
}

/**
 * Selector de colaborador con búsqueda en el servidor, sin react-hook-form
 *
 * @remarks
 * No filtra en el navegador: avisa el texto escrito (con espera) y muestra lo
 * que se le pasa en `options`. El elegido no desaparece de la lista aunque la
 * búsqueda siguiente no lo incluya. Sirve de filtro suelto; para un formulario
 * se usa `ColaboradorCombobox`.
 */
export function ColaboradorSelect({
  value,
  onChange,
  options,
  isLoading = false,
  onSearchChange,
  selectedLabel,
  placeholder = "Busca por nombre o documento",
  id,
  ariaLabel,
  invalid,
  className,
}: ColaboradorSelectProps) {
  // Último elegido por el usuario: conserva su nombre si la búsqueda lo saca de la lista
  const [chosen, setChosen] = useState<EmpleadoMarcableOption | null>(null);
  const { run: sendSearch } = useDebouncedCallback(
    onSearchChange,
    BUSQUEDA_DELAY_MS,
  );

  const selected = !value
    ? null
    : (options.find((option) => option.value === value) ??
      (chosen?.value === value ? chosen : null) ??
      (selectedLabel
        ? { value, label: selectedLabel, nro_documento: "" }
        : null));

  const items =
    selected && !options.some((option) => option.value === selected.value)
      ? [selected, ...options]
      : options;

  return (
    <Combobox
      items={items}
      filter={null}
      value={selected}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(item, current) => item.value === current.value}
      onValueChange={(next) => {
        setChosen(next);
        onChange(next?.value);
      }}
      onInputValueChange={(text, { reason }) => {
        // Al elegir una opción el campo se rellena solo: eso no es buscar
        if (reason === "input-change" || reason === "input-clear")
          sendSearch(text.trim());
      }}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        className={className}
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
                {item.nro_documento && (
                  <span className="text-xs text-muted-foreground">
                    {item.nro_documento}
                  </span>
                )}
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
