"use client";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/deliveries": "Entregas",
  "/routes": "Rotas",
  "/vehicles": "Veículos",
  "/drivers": "Motoristas",
  "/reports": "Relatórios",
  "/settings": "Configurações",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const pageTitle =
    breadcrumbMap[pathname] ||
    Object.entries(breadcrumbMap).find(([key]) => pathname.startsWith(key) && key !== "/")?.[1] ||
    "Página";

  const initials = user?.name
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 gap-4">
      {/* Breadcrumb */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-2 text-sm border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell className="h-5 w-5" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
            {initials || "U"}
          </div>
          {user && (
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
