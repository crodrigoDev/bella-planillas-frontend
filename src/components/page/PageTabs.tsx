import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageTab {
  value: string;
  label: string;
}

interface PageTabsProps {
  tabs: PageTab[];
  /** Valor de la pestaña activa */
  value: string;
  onChange: (value: string) => void;
  /** Texto para lectores de pantalla que describe el grupo de pestañas */
  label: string;
}

/** Id de cada pestaña y de su panel, para enlazarlos con `aria-controls` */
const getTabId = (value: string) => `tab-${value}`;
const getTabPanelId = (value: string) => `tabpanel-${value}`;

/**
 * Barra de pestañas de una página
 *
 * @remarks
 * Es controlada: la página decide qué pestaña está activa (por ejemplo desde
 * `?tab=` en la URL) y pinta su panel con `role="tabpanel"`.
 * Con las flechas izquierda y derecha, Inicio y Fin se cambia de pestaña.
 */
export function PageTabs({ tabs, value, onChange, label }: PageTabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = tabs.findIndex((tab) => tab.value === value);
    const last = tabs.length - 1;
    const keyTargets: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    const next = keyTargets[event.key];

    if (next === undefined) return;

    event.preventDefault();
    onChange(tabs[next].value);
    document.getElementById(getTabId(tabs[next].value))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex gap-6 overflow-x-auto border-b"
    >
      {tabs.map((tab) => {
        const active = tab.value === value;

        return (
          <button
            key={tab.value}
            id={getTabId(tab.value)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={getTabPanelId(tab.value)}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              "-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Panel de la pestaña activa; envuelve el contenido que le corresponde
 */
export function PageTabPanel({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={getTabPanelId(value)}
      aria-labelledby={getTabId(value)}
    >
      {children}
    </div>
  );
}
