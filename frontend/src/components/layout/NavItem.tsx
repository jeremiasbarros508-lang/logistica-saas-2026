"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function NavItem({ href, label, icon: Icon, onClick }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary-500 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {label}
    </Link>
  );
}
