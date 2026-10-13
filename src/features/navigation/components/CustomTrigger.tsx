import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "cn";
import { ChevronRight } from "lucide-react";

/**
 * Alterna el sidebar entre expandido y colapsado
 */
export function CustomTrigger() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      size="icon-sm"
      className=" rounded-full bg-primary"
      aria-label={
        state === "expanded" ? "Colapsar el Sidebar" : "Expandir el Sidebar"
      }
      title={
        state === "expanded" ? "Colapsar el Sidebar" : "Expandir el Sidebar"
      }
    >
      <ChevronRight
        color="white"
        className={cn(state === "expanded" && "rotate-180", "size-4 mx-auto")}
      />
    </Button>
  );
}
