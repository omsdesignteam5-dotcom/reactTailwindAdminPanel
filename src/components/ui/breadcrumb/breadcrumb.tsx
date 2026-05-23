import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type ComponentProps, type ReactNode } from "react";

//Icons
import { ChevronRight, MoreHorizontal } from "lucide-react";

//Utils
import { cn } from "../../../utils/utils";

const Breadcrumb = forwardRef<
  HTMLElement,
  ComponentProps<"nav"> & { separator?: ReactNode }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<HTMLOListElement, ComponentProps<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  ),
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  ComponentProps<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const linkClassName = cn(
    "transition-colors hover:text-foreground",
    className,
  );

  if (asChild) {
    return <Slot className={linkClassName} {...props} />;
  }

  return <a ref={ref} className={linkClassName} {...props} />;
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<HTMLSpanElement, ComponentProps<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  ),
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:h-3.5 [&>svg]:w-3.5", className)}
    {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
