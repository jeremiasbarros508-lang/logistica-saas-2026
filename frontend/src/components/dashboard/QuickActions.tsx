"use client";

import Link from "next/link";
import { Plus, Upload, Route, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    href: "/deliveries/new",
    label: "Nova Entrega",
    icon: Plus,
    description: "Cadastrar entrega",
    variant: "default" as const,
  },
  {
    href: "/deliveries/import",
    label: "Importar CSV",
    icon: Upload,
    description: "Importar em massa",
    variant: "outline" as const,
  },
  {
    href: "/routes/new",
    label: "Nova Rota",
    icon: Route,
    description: "Gerar roteirização",
    variant: "outline" as const,
  },
  {
    href: "/reports",
    label: "Relatórios",
    icon: FileText,
    description: "Ver métricas",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs opacity-70">{action.description}</p>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
