import { useLayoutEffect, useRef } from "react";
import { NavLink, matchPath, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

export interface PageTab {
  /** Ruta a la que lleva la pestaña */
  to: string;
  label: string;
  /** La pestaña solo está activa con esa ruta exacta (la pestaña inicial) */
  end?: boolean;
}

interface PageTabsProps {
  tabs: PageTab[];
  /** Texto para lectores de pantalla que describe la navegación */
  label: string;
}

/**
 * Pestañas de una página, donde cada una es una ruta
 *
 * @remarks
 * La pestaña activa sale de la URL. Son enlaces reales (se pueden abrir en
 * otra pestaña del navegador) y el subrayado se desliza hasta la activa;
 * se mueve por el DOM directamente para no volver a renderizar al medir.
 */
export function PageTabs({ tabs, label }: PageTabsProps) {
  const { pathname } = useLocation();
  const listRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const activeIndex = tabs.findIndex((tab) =>
    matchPath({ path: tab.to, end: tab.end ?? false }, pathname),
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const moveIndicator = () => {
      const active = list.querySelector<HTMLElement>("[aria-current='page']");
      if (!active) return;

      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    };

    moveIndicator();

    // Si cambia el ancho de la barra (o carga la fuente), el subrayado se reubica
    const observer = new ResizeObserver(moveIndicator);
    observer.observe(list);

    return () => observer.disconnect();
  }, [activeIndex, tabs]);

  return (
    <nav
      ref={listRef}
      aria-label={label}
      className="relative flex gap-8 overflow-x-auto border-b"
    >
      {tabs.map((tab, index) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={cn(
            "mb-2 inline-flex h-7 shrink-0 items-center rounded-lg px-2.5 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
            index === activeIndex
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </NavLink>
      ))}

      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
      />
    </nav>
  );
}
