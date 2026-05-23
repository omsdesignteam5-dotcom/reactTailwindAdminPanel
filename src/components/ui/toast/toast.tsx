import * as ToastPrimitive from "@radix-ui/react-toast";
import { forwardRef, type ComponentProps, type ComponentRef } from "react";

//Icons
import { X } from "lucide-react";

//Utils
import { cn } from "../../../utils/utils";

//Types
import type { ToastVariant, ToastPosition } from "./useToast";

/* ── provider ───────────────────────────── */
const ToastProvider = ToastPrimitive.Provider;

/* ── viewport ───────────────────────────── */
const positionClasses: Record<ToastPosition, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "top-center": "top-0 left-[50%] -translate-x-[50%]",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-center": "bottom-0 left-[50%] -translate-x-[50%]",
};

interface ToastViewportProps extends ComponentProps<
  typeof ToastPrimitive.Viewport
> {
  position?: ToastPosition;
}

const ToastViewport = forwardRef<
  ComponentRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, position = "top-right", ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed z-100 flex max-h-screen w-full p-4 sm:max-w-105",
      position.startsWith("top") ? "flex-col" : "flex-col-reverse",
      positionClasses[position],
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

/* ── variant map ────────────────────────── */
const variantClasses: Record<ToastVariant, string> = {
  default: "border bg-background text-foreground",
  success:
    "border-green-500/30 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-100 dark:border-green-500/20",
  destructive:
    "border-destructive/30 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-100 dark:border-destructive/20",
  warning:
    "border-amber-500/30 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-500/20",
  info: "border-blue-500/30 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-500/20",
  neutral:
    "border-muted/30 bg-muted-50  text-muted-foreground dark:bg-muted/20 dark:text-muted-foreground dark:border-muted/10",
};

/* ── toast root ─────────────────────────── */
interface ToastProps extends ComponentProps<typeof ToastPrimitive.Root> {
  variant?: ToastVariant;
  position?: ToastPosition;
}

const Toast = forwardRef<ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  ({ className, variant = "default", position, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      data-position={position}
      className={cn(
        "toast-item group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Toast.displayName = "Toast";

/* ── action ─────────────────────────────── */
const ToastAction = forwardRef<
  ComponentRef<typeof ToastPrimitive.Action>,
  ComponentProps<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors",
      "hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = "ToastAction";

/* ── close ──────────────────────────────── */
const ToastClose = forwardRef<
  ComponentRef<typeof ToastPrimitive.Close>,
  ComponentProps<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity",
      "hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100",
      className,
    )}
    toast-close=""
    {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = "ToastClose";

/* ── title ──────────────────────────────── */
const ToastTitle = forwardRef<
  ComponentRef<typeof ToastPrimitive.Title>,
  ComponentProps<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

/* ── description ────────────────────────── */
const ToastDescription = forwardRef<
  ComponentRef<typeof ToastPrimitive.Description>,
  ComponentProps<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
