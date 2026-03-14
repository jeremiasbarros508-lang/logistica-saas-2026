import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Carregando..."
    />
  );
}

export function SpinnerOverlay() {
  return (
    <div className="flex h-full w-full items-center justify-center py-12">
      <Spinner size="lg" className="text-primary-500" />
    </div>
  );
}
