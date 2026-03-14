import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  iconClassName?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className,
  iconClassName,
}: KPICardProps) {
  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-500" />,
    down: <TrendingDown className="h-4 w-4 text-red-500" />,
    neutral: <Minus className="h-4 w-4 text-gray-400" />,
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            {trend && trendValue && (
              <div className={cn("mt-2 flex items-center gap-1 text-sm", trendColors[trend])}>
                {trendIcons[trend]}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-primary-100",
              iconClassName
            )}
          >
            <Icon className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
