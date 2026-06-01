import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const tamanhos = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Carregando…"
      className={cn(
        "animate-spin rounded-full border-brand-200 border-t-brand-600",
        tamanhos[size],
        className
      )}
    />
  );
}
