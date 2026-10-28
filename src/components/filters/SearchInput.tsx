import { useEffect, useState, type ChangeEvent } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { cn } from "cn";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  value: string; // Busqueda vigente
  onSearch: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  debounceMs?: number;
  className?: string;
}

/**
 * Campo de búsqueda que avisa solo cuando se deja de escribir
 *
 * @remarks
 * Tiene su propio texto para que escribir no dependa de lo rápido que se
 * actualice `value`. Si `value` cambia por otra vía (botón atrás, limpiar
 * filtros), el campo pasa a mostrarlo y descarta lo que estaba pendiente.
 */
export function SearchInput({
  value,
  onSearch,
  placeholder,
  ariaLabel,
  debounceMs = 400,
  className,
}: SearchInputProps) {
  const [input, setInput] = useState(value);
  // Último texto que este campo envió, si `value` difiere, el cambio fue externo
  const [sentValue, setSentValue] = useState(value);
  const [externalChanges, setExternalChanges] = useState(0);

  if (value !== sentValue) {
    setSentValue(value);
    setInput(value);
    setExternalChanges((count) => count + 1);
  }

  const { run: sendSearch, cancel: cancelSearch } = useDebouncedCallback(
    (next: string) => {
      setSentValue(next);
      onSearch(next);
    },
    debounceMs,
  );

  // Una búsqueda pendiente no debe pisar un cambio externo
  useEffect(() => {
    cancelSearch();
  }, [externalChanges, cancelSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    sendSearch(event.target.value.trim());
  };

  return (
    <InputGroup className={cn("w-full sm:w-72", className)}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </InputGroup>
  );
}
