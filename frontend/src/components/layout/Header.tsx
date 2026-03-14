"use client";

import { Menu, Bell } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/deliveries": "Entregas",
  "/routes": "Rotas",
  "/vehicles": "Veículos",
  "/drivers": "Motoristas",
  "/reports": "Relatórios",
  "/settings": "Configurações",
};

function getTitle(pathname: string): string {
  for (const [key, value] of Object.entries(routeTitles)) {
    if (key !== "/" && pathname.startsWith(key)) return value;
  }
  if (pathname === "/") return "Dashboard";
  return "LogísticaSaaS";
}

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuth();
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-md p-2 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user?.name ?? "Usuário"}
          </span>
        </div>
      </div>
    </header>
  );
}
