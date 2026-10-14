import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ModuleSelectProps {
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputRef?: (element: HTMLButtonElement | null) => void;
  invalid?: boolean;
}

/** Usa las mismas opciones de shadcn para filtros y formularios */
export default function ModuleSelect({
  label,
  value,
  items,
  onChange,
  onBlur,
  inputRef,
  invalid,
}: ModuleSelectProps) {
  const id = useId();
  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
        }}
      >
        <SelectTrigger
          id={id}
          ref={inputRef}
          onBlur={onBlur}
          aria-invalid={invalid}
          className="h-9 w-full min-w-0 bg-background text-xs"
        >
          <SelectValue placeholder="Selecciona" />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
