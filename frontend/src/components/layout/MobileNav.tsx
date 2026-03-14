"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Route, Truck, UserCheck, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deliveries", label: "Entregas", icon: Package },
  { href: "/routes", label: "Rotas", icon: Route },
  { href: "/vehicles", label: "Veículos", icon: Truck },
  { href: "/drivers", label: "Motoristas", icon: UserCheck },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/settings", label: "Config.", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors",
                active ? "text-primary-500" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
