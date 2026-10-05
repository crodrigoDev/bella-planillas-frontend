import { RouterProvider } from "react-router-dom";
import { router } from "@/app/routes/router";

/**
 * Renderiza las rutas principales de la aplicación
 */
export default function App() {
  return <RouterProvider router={router} />;
}
