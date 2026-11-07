import { PaperclipIcon } from "lucide-react";

interface SustentoSolicitudProps {
  /** Nombre del archivo adjunto; `null` si la solicitud no tiene sustento */
  nombre: string | null;
}

/**
 * Sustento de la solicitud: solo su nombre
 *
 * @remarks
 * El backend todavía no ofrece descargar el archivo, por eso no hay enlace.
 */
export function SustentoSolicitud({ nombre }: SustentoSolicitudProps) {
  return (
    <section
      aria-labelledby="sustento-solicitud-title"
      className="space-y-2 rounded-lg border bg-card p-4"
    >
      <h2 id="sustento-solicitud-title" className="text-base font-semibold">
        Sustento
      </h2>

      {nombre ? (
        <>
          <p className="flex items-center gap-2 text-sm font-medium wrap-break-word">
            <PaperclipIcon aria-hidden className="size-4 shrink-0" />
            {nombre}
          </p>
          <p className="text-sm text-muted-foreground">
            Todavía no se puede descargar el archivo desde el sistema.
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          La solicitud no tiene sustento adjunto.
        </p>
      )}
    </section>
  );
}
