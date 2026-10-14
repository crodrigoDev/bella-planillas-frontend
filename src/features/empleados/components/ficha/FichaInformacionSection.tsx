import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FichaInformacionSectionProps {
  title: string;
  icon: LucideIcon;
  items: { label: string; value: ReactNode }[];
}

/** Presenta datos de lectura y aclara cuando falta informacion */
export default function FichaInformacionSection({ title, icon: Icon, items }: FichaInformacionSectionProps) {
  return (
    <Card className="gap-5 py-5 shadow-none ring-border">
      <CardHeader className="px-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/7 text-primary"><Icon aria-hidden="true" className="size-4" /></span>
          {title}
        </h3>
      </CardHeader>
      <CardContent className="px-5">
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {items.map(({ label, value }) => (
            <div key={label} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium">{value === null || value === undefined || value === "" ? <span className="font-normal text-muted-foreground">No registrado</span> : value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
