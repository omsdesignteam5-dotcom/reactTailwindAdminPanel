import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { forwardRef, type ComponentProps, type ComponentRef } from "react";

//Utils
import { cn } from "../../../utils/utils";

const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive.Root>,
  ComponentProps<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";

export { Separator };
