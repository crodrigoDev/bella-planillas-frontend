import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

/** Reutiliza la presentacion de la busqueda del listado de empleados */
export default function ModuleSearch({
  label,
  placeholder,
  value,
  onChange,
  className = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <InputGroup className="h-9 bg-background">
        <InputGroupAddon>
          <Search aria-hidden className="size-4 text-slate-400" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="text-xs text-slate-700 placeholder:text-slate-400 dark:text-foreground"
        />
      </InputGroup>
    </div>
  );
}
