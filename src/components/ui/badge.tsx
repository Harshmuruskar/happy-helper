import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90",
        outline: "border-border text-foreground",
        gold: "border-[var(--champagne)]/40 bg-[var(--gold-soft)] text-[var(--champagne)]",
        sage: "border-[var(--sage)]/35 bg-[var(--sage)]/15 text-[var(--sage)]",
        sunset: "border-[var(--sunset)]/40 bg-[var(--sunset)]/15 text-[var(--sunset)]",
        ocean: "border-[var(--ocean)]/30 bg-[var(--ocean)]/10 text-[var(--ocean)]",
        sky: "border-[var(--sky)]/40 bg-[var(--sky)]/15 text-[var(--primary)]",
        copper: "border-[var(--copper)]/35 bg-[var(--copper)]/15 text-[var(--copper)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
