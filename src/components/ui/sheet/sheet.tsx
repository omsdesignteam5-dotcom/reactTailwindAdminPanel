import {
  forwardRef,
  type ComponentProps,
  type ComponentRef,
  type HTMLAttributes,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

//icons
import { X } from "lucide-react";

//utils
import { cn } from "../../../utils/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn("sheet-overlay fixed inset-0 z-50 bg-black/20", className)}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps extends ComponentProps<
  typeof DialogPrimitive.Content
> {
  side?: "top" | "right" | "bottom" | "left";
}

const sheetSideClasses = {
  top: "inset-x-0 top-0 border-b sheet-slide-top",
  bottom: "inset-x-0 bottom-0 border-t sheet-slide-bottom",
  left: "inset-y-0 start-0 h-full w-3/4 border-e sm:max-w-sm sheet-slide-left",
  right: "inset-y-0 end-0 h-full w-3/4 border-s sm:max-w-sm sheet-slide-right",
};

const SheetContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      aria-describedby={undefined}
      className={cn(
        "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg",
        sheetSideClasses[side],
        className,
      )}
      {...props}>
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

const SheetTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentProps<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentProps<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
