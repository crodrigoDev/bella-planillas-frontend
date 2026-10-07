import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/features/auth/components/LoginForm";

/**
 * Presenta la Card de acceso a la aplicación
 */
export default function LoginPage() {
  return (
    <Card className="w-full max-w-md gap-6 py-8 shadow-sm ring-0">
      <CardHeader className="gap-2 px-8">
        <CardTitle>
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
        </CardTitle>

        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
