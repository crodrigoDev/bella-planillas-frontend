import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/router";

/**
 * Conecta la aplicación con el sistema de navegación
 */
export default function App() {
  return <RouterProvider router={router} />;
}
