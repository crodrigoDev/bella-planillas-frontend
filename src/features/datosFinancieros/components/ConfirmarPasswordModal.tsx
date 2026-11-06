import { useState, type FormEvent } from "react";

import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { ModalFormFooter } from "@/components/form/ModalFormFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ConfirmarPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Se ejecuta con la contraseña escrita al confirmar */
  onConfirm: (password: string) => void;
  isPending: boolean;
  /** Error del último intento, por ejemplo "contraseña incorrecta" */
  error: unknown;
}

/**
 * Modal que pide la contraseña del usuario antes de guardar cambios financieros
 *
 * @remarks
 * El backend exige la contraseña para cualquier cambio en los datos
 * financieros. El contenido está dentro del modal: al cerrarse se desmonta y
 * la contraseña escrita se descarta.
 */
export function ConfirmarPasswordModal({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  error,
}: ConfirmarPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <ConfirmarPasswordForm
          onConfirm={onConfirm}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}

type ConfirmarPasswordFormProps = Pick<
  ConfirmarPasswordModalProps,
  "onConfirm" | "isPending" | "error"
>;

function ConfirmarPasswordForm({
  onConfirm,
  isPending,
  error,
}: ConfirmarPasswordFormProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password) onConfirm(password);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Confirma tu contraseña</DialogTitle>
        <DialogDescription>
          Por seguridad, escribe tu contraseña para guardar los cambios en los
          datos financieros.
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="confirmar-password">Contraseña</FieldLabel>
        <Input
          id="confirmar-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isPending}
          autoFocus
        />
      </Field>

      <ErrorAlert error={error} />

      <ModalFormFooter
        isPending={isPending}
        submitLabel="Guardar cambios"
        disabled={!password}
      />
    </form>
  );
}
