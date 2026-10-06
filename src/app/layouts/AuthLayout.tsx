import AuthBrandPanel from "@/features/auth/components/AuthBrandPanel";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background lg:grid lg:grid-cols-2">
      <AuthBrandPanel />
      <main className="flex flex-1 items-center justify-center bg-primary/2.5 px-6 py-12 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
}
