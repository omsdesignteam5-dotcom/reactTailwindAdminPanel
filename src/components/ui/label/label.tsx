import * as LabelPrimitive from "@radix-ui/react-label";
import { forwardRef, type ComponentProps, type ComponentRef } from "react";

//Utils
import { cn } from "src/utils/utils";

const Label = forwardRef<
  ComponentRef<typeof LabelPrimitive.Root>,
  ComponentProps<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
