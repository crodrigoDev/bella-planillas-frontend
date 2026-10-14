import { Link } from "react-router-dom";
import { Cake, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardDesignMock } from "../types/dashboard.types";
import DashboardPanel from "./DashboardPanel";

/** Presenta fechas de ejemplo para el bloque de cumpleaños del diseño */
export default function DashboardBirthdays({
  items,
}: {
  items: DashboardDesignMock["cumpleaños"];
}) {
  return (
    <DashboardPanel
      title={
        <span className="flex items-center gap-2">
          <span className="rounded-md bg-primary/5 p-1.5">
            <Cake aria-hidden className="size-4 text-primary" />
          </span>
          Próximos cumpleaños
        </span>
      }
      action={
        <Badge
          variant="outline"
          className="border-primary/15 bg-primary/5 text-[9px] text-primary"
        >
          Octubre 2026
        </Badge>
      }
    >
      <div className="divide-y divide-border/40">
        {items.map((item, index) => (
          <div
            key={item.empleado_id}
            className="flex items-center justify-between gap-3 py-3 first:pt-0"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/empleados/${item.empleado_id}`}
                  className="text-[11px] font-medium hover:text-primary"
                >
                  {item.nombre}
                </Link>
                {index === 0 && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 px-1 py-0 text-[9px] text-emerald-700"
                  >
                    Próximo
                  </Badge>
                )}
              </div>
              <p className="mt-1 truncate text-[9px] text-muted-foreground">
                {item.cargo} · {item.area}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] font-medium">
                  {item.fecha.slice(-2)} oct.
                </p>
                <p
                  className={`mt-1 text-[9px] ${index === 0 ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  En {item.dias} días
                </p>
              </div>
              {index === 0 && (
                <PartyPopper aria-hidden className="size-4 text-slate-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}
