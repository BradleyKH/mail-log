import { cn } from "@/lib/utils";

export const navLinkClass = (isActive: boolean) =>
  cn(
    "rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
    isActive && "bg-secondary text-foreground underline decoration-primary decoration-2 underline-offset-[6px]",
  );
