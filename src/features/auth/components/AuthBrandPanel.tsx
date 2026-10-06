import { Badge } from "@/components/ui/badge";
import { Building, ShieldCheck } from "lucide-react";

/**
 * Presenta la marca y el mensaje de bienvenida
 */
export default function AuthBrandPanel() {
  return (
    <aside className="flex flex-col bg-primary p-6 text-primary-foreground lg:p-10">
      <header className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-white/15">
          <Building className="size-5" aria-hidden="true" />
        </span>

        <div className="leading-tight">
          <p className="text-base font-semibold">Bella Planillas</p>
          <p className="text-xs text-primary-foreground/80">por Bellasoft</p>
        </div>
      </header>

      <div className="hidden flex-1 items-center py-12 lg:flex">
        <div className="max-w-md space-y-4">
          <Badge className="bg-white/15 text-primary-foreground">
            <ShieldCheck aria-hidden="true" />
            Entorno Corporativo Seguro
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Planillas
          </h2>

          <p className="text-sm leading-relaxed text-primary-foreground/90">
            La solución integral para la gestión eficiente de su capital humano,
            retenciones tributarias y nómina fiscal con precisión milimétrica.
          </p>
        </div>
      </div>

      <footer className="hidden text-xs leading-relaxed text-primary-foreground/70 lg:block">
        @ {new Date().getFullYear()} Bella Planillas. Todos los derechos
        reservados. Uso exclusivo de personal autorizado
      </footer>
    </aside>
  );
}
