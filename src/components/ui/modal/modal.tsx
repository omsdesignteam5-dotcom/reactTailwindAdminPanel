import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  forwardRef,
  type ComponentProps,
  type ComponentRef,
  type HTMLAttributes,
} from "react";

//Icons
import { X } from "lucide-react";

//Utils
import { cn } from "../../../utils/utils";

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

const ModalOverlay = forwardRef<
  ComponentRef<typeof DialogPrimitive.Overlay>,
  ComponentProps<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("dialog-overlay fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

interface ModalContentProps extends ComponentProps<
  typeof DialogPrimitive.Content
> {
  showClose?: boolean;
}

const ModalContent = forwardRef<
  ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, showClose = true, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      aria-describedby={undefined}
      className={cn(
        "dialog-content fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
        "gap-4 border border-border bg-background p-6 shadow-lg rounded-lg",
        "max-h-[calc(100dvh-2rem)] overflow-y-auto",
        className,
      )}
      {...props}>
      {children}
      {showClose && (
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-sm p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = "ModalContent";

function ModalHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className,
      )}
      {...props}
    />
  );
}

function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center justify-center gap-2 sm:flex-row",
        className,
      )}
      {...props}
    />
  );
}

const ModalTitle = forwardRef<
  ComponentRef<typeof DialogPrimitive.Title>,
  ComponentProps<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef<
  ComponentRef<typeof DialogPrimitive.Description>,
  ComponentProps<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
