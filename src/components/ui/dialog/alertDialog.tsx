import {
  forwardRef,
  type ComponentProps,
  type ComponentRef,
  type HTMLAttributes,
} from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

//Utils
import { cn } from "../../../utils/utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentProps<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn("dialog-overlay fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

const AlertDialogContent = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Content>,
  ComponentProps<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "dialog-content fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
        "gap-4 border border-border bg-background p-6 shadow-lg rounded-lg",
        "max-h-[calc(100dvh-2rem)] overflow-y-auto",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

function AlertDialogHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
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

function AlertDialogFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
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

const AlertDialogTitle = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Title>,
  ComponentProps<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Description>,
  ComponentProps<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

import { Button, type ButtonProps } from "../button/button";

const AlertDialogAction = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Action>,
  ComponentProps<typeof AlertDialogPrimitive.Action> &
    Pick<ButtonProps, "variant" | "size">
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} asChild>
    <Button className={className} {...(props as any)} />
  </AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = forwardRef<
  ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  ComponentProps<typeof AlertDialogPrimitive.Cancel> &
    Pick<ButtonProps, "variant" | "size">
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} asChild>
    <Button variant="outline" className={className} {...(props as any)} />
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
