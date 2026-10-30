import { useLayoutEffect, useRef } from "react";
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
 * `?tab=` en la URL) y pinta su panel con `PageTabPanel`.
 * Con las flechas izquierda y derecha, Inicio y Fin se cambia de pestaña.
 * El subrayado se desliza hasta la pestaña activa; se mueve por el DOM
 * directamente para no volver a renderizar al medir.
 */
export function PageTabs({ tabs, value, onChange, label }: PageTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const moveIndicator = () => {
      const active = document.getElementById(getTabId(value));
      if (!active) return;

      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    };

    moveIndicator();

    // Si cambia el ancho de la barra (o carga la fuente), el subrayado se reubica
    const observer = new ResizeObserver(moveIndicator);
    observer.observe(list);

    return () => observer.disconnect();
  }, [value, tabs]);

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
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="relative flex gap-8 overflow-x-auto border-b"
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
              "shrink-0 pb-3.5 text-base font-medium transition-colors outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}

      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-full bg-primary transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
      />
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
