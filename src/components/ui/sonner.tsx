import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Contenedor donde aparecen los avisos (toasts) de la aplicación
 *
 * @remarks
 * Usa el aspecto por defecto de sonner (tema claro) y solo toma del tema
 * de la aplicación el fondo, el texto, el borde y el radio.
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
