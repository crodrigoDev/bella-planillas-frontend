import { Outlet } from "react-router-dom";

/**
 * Define la estructura compartida por las páginas internas del sistema.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
