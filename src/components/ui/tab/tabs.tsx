import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef, type ComponentProps, type ComponentRef } from "react";

//Utils
import { cn } from "../../../utils/utils";

const Tabs = TabsPrimitive.Root;

/* ── variant styles ──────────────────────── */
type TabsListVariant = "default" | "underline" | "pill";

interface TabsListProps extends ComponentProps<typeof TabsPrimitive.List> {
  variant?: TabsListVariant;
}

const listVariants: Record<TabsListVariant, string> = {
  default:
    "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
  underline:
    "inline-flex h-9 items-center justify-center gap-4 border-b border-border text-muted-foreground",
  pill: "inline-flex h-9 items-center justify-center gap-1 text-muted-foreground",
};

const TabsList = forwardRef<
  ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-variant={variant}
    className={cn(listVariants[variant], className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/* ── trigger variants ────────────────────── */
interface TabsTriggerProps extends ComponentProps<
  typeof TabsPrimitive.Trigger
> {
  variant?: TabsListVariant;
}

const triggerVariants: Record<TabsListVariant, string> = {
  default: [
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
  ].join(" "),
  underline: [
    "inline-flex items-center justify-center whitespace-nowrap pb-2 px-1 text-sm font-medium transition-all relative",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=active]:text-foreground",
    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform after:duration-200",
    "data-[state=active]:after:scale-x-100",
  ].join(" "),
  pill: [
    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    "hover:bg-muted/60 hover:text-foreground",
    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
  ].join(" "),
};

const TabsTrigger = forwardRef<
  ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(triggerVariants[variant], className)}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef<
  ComponentRef<typeof TabsPrimitive.Content>,
  ComponentProps<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
export type { TabsListVariant };
