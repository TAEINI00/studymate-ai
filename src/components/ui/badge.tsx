import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        safe: "border-status-safe/20 bg-status-safe-bg text-status-safe",
        warning: "border-status-warning/20 bg-status-warning-bg text-status-warning",
        danger: "border-status-danger/20 bg-status-danger-bg text-status-danger animate-pulse",
        easy: "border-status-safe/20 bg-status-safe-bg text-status-safe",
        medium: "border-status-warning/20 bg-status-warning-bg text-status-warning",
        hard: "border-status-danger/20 bg-status-danger-bg text-status-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
