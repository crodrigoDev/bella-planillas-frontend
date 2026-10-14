import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { moduleDate } from "@/components/modules/module.utils";
import type { AuditListado } from "../types/auditoria.types";

/** Expone los valores guardados en la auditoria sin permitir modificarlos */
export default function AuditDetailDialog({
  registro,
  onClose,
}: {
  registro: AuditListado;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {registro.accion} · {registro.tabla_afectada}
          </DialogTitle>
          <DialogDescription>
            {moduleDate(registro.created_at)} · {registro.usuarios.email}
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-2 break-all text-xs">
          <div>
            <dt className="text-muted-foreground">Registro</dt>
            <dd>{registro.registro_id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Usuario / IP</dt>
            <dd>
              {registro.usuario_id} · {registro.direccion_ip}
            </dd>
          </div>
        </dl>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Antes", values: registro.valores_antes },
            { title: "Después", values: registro.valores_despues },
          ].map((item) => (
            <div key={item.title} className="min-w-0 space-y-2">
              <h3 className="text-xs font-medium">{item.title}</h3>
              <pre className="whitespace-pre-wrap break-all rounded-lg bg-muted p-3 text-xs">
                {item.values
                  ? JSON.stringify(item.values, null, 2)
                  : "Sin valores previos"}
              </pre>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
