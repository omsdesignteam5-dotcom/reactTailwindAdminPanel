import { forwardRef, type HTMLAttributes } from "react";

//Utils
import { cn } from "../../../utils/utils";

const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
