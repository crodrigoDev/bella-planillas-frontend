import { Button } from "@/components/ui/button";

/** Presenta opciones cortas como botones para escoger sin abrir un menu */
export default function JornadaChoiceGroup({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.value}
            type="button"
            size="sm"
            variant="outline"
            aria-pressed={item.value === value}
            onClick={() => { if (item.value !== value) onChange(item.value); }}
            className={
              item.value === value
                ? "border-primary bg-primary/5 text-primary"
                : "text-muted-foreground"
            }
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
