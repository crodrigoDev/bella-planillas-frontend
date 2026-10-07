import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

type PasswordInputProps = Omit<ComponentProps<typeof InputGroupInput>, "type">;

/**
 * Campo de contraseña con control para mostrar u ocultar
 *
 * @remarks
 * Transmite las propiedades al input interno para permitir su conexion
 * con React Hook Form. El tipo de input se controla desde el componente
 */
export default function PasswordInput(props: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup className="h-10">
      <InputGroupInput {...props} type={showPassword ? "text" : "password"} />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          type="button"
          size="icon-sm"
          disabled={props.disabled}
          aria-pressed={showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff aria-hidden="true" />
          ) : (
            <Eye aria-hidden="true" />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
