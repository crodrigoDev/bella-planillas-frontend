import { Link } from "react-router-dom";

import { ROUTE_PATHS } from "@/app/routes/path";

/**
 * Informa que la ruta no existe.
 *
 * La página contiene un botón que redirige al usuario
 * al dashboard
 */
export default function NotFoundPage() {
  return (
    <main>
      <section aria-labelledby="not-found-title">
        <p>Error 404</p>

        <h1 id="not-found-title">Página no encontrada</h1>

        <p>
          La dirección ingresada no corresponde a una página disponible en el
          sistema.
        </p>

        <Link to={ROUTE_PATHS.dashboard}>Volver al dashboard</Link>
      </section>
    </main>
  );
}
