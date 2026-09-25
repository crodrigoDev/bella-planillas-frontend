import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/router";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * Conecta la aplicación con el sistema de navegación
 */
export default function App() {
  return (
    <TooltipProvider delay={0}>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}
