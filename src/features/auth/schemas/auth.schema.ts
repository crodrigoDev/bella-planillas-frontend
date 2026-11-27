import { z } from "zod";

/**
 * Schema de validación para restablecer contraseña
 */
export const RestablecerFormSchema = z
  .object({
    nueva_password: z
      .string()
      .min(12, "La contraseña debe tener mínimo 12 caracteres"),
    confirmar_password: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((values) => values.nueva_password === values.confirmar_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar_password"],
  });

// Type inferido del schema
export type RestablecerFormValues = z.infer<typeof RestablecerFormSchema>;
