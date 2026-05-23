import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";

//icons
import { ChevronRight } from "lucide-react";

//utils
import { cn } from "../utils/utils";

//context
import { useSidebar } from "../context/sidebarContext";

//components
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown/dropdownMenu";

//types
import type {
  NavGroup as NavGroupType,
  NavLink as NavLinkType,
  NavCollapsible as NavCollapsibleType,
  NavItem,
} from "./sidebarTypes";

interface SidebarNavProps {
  groups: NavGroupType[];
}

function useIsNavExpanded() {
  const { layout, isOpen: isSheetOpen, isMobile } = useSidebar();
  // if it's mobile or full layout, Nav is inside a Sheet, meaning when it renders it should be expanded.
  // otherwise, it's expanded only if layout === 'expanded'.
  return layout === "expanded" || isMobile || isSheetOpen;
}

export function SidebarNav({ groups }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-4 px-2 py-2">
      {groups.map((group) => (
        <NavGroup key={group.title} {...group} />
      ))}
    </nav>
  );
}

function NavGroup({ title, items }: NavGroupType) {
  const isOpen = useIsNavExpanded();

  return (
    <div className="flex flex-col gap-0.5">
      {isOpen && (
        <span className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/75">
          {title}
        </span>
      )}
      {!isOpen && <div className="mx-auto mb-1 h-px w-4 bg-border" />}
      {items.map((item) => {
        const key = `${item.title}-${item.url ?? ""}`;
        if (!item.items) {
          return <SidebarMenuLink key={key} item={item as NavLinkType} />;
        }
        return (
          <SidebarMenuCollapsible key={key} item={item as NavCollapsibleType} />
        );
      })}
    </div>
  );
}

function SidebarMenuLink({ item }: { item: NavLinkType }) {
  const isOpen = useIsNavExpanded();
  const { isMobile, setOpen } = useSidebar();
  const { pathname } = useLocation();
  const isActive = pathname === item.url;

  const linkContent = (
    <Link
      to={item.url as any}
      onClick={() => {
        if (isMobile) setOpen(false);
      }}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          : "text-sidebar-foreground/85",
        !isOpen && "justify-center px-0",
      )}>
      {item.icon && (
        <item.icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-white" : "text-sidebar-foreground/80",
          )}
        />
      )}
      {isOpen && <span className="truncate">{item.title}</span>}
      {isOpen && item.badge && (
        <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (!isOpen) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

function SidebarMenuCollapsible({ item }: { item: NavCollapsibleType }) {
  const sidebarOpen = useIsNavExpanded();
  const { isMobile, setOpen: setSidebarOpen } = useSidebar();
  const { pathname } = useLocation();
  const isChildActive = item.items.some((sub) => pathname === sub.url);

  // When sidebar is collapsed, show dropdown instead
  if (!sidebarOpen && !isMobile) {
    return <CollapsedDropdown item={item} />;
  }

  return (
    <Collapsible.Root defaultOpen={isChildActive} className="group/collapsible">
      <Collapsible.Trigger
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isChildActive
            ? "bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            : "text-sidebar-foreground/85",
        )}>
        {item.icon && (
          <item.icon
            className={cn(
              "h-4 w-4 shrink-0",
              isChildActive ? "text-white" : "text-sidebar-foreground/80",
            )}
          />
        )}
        <span className="truncate">{item.title}</span>
        {item.badge && (
          <span className="ml-auto mr-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {item.badge}
          </span>
        )}
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      </Collapsible.Trigger>
      <Collapsible.Content className="CollapsibleContent">
        <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-3 pt-1">
          {item.items.map((sub) => {
            const isSubActive = pathname === sub.url;
            return (
              <Link
                key={sub.url}
                to={sub.url as any}
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isSubActive
                    ? "bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-sidebar-foreground/85",
                )}>
                {sub.icon && <sub.icon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{sub.title}</span>
                {sub.badge && (
                  <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {sub.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function CollapsedDropdown({ item }: { item: NavCollapsibleType }) {
  const { pathname } = useLocation();
  const isChildActive = item.items.some((sub) => pathname === sub.url);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            className={cn(
              "flex w-full items-center justify-center rounded-md py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isChildActive
                ? "bg-white/20 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                : "text-sidebar-foreground/85",
            )}>
            {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent side="right" align="start" sideOffset={8}>
        <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {item.items.map((sub) => (
          <DropdownMenuItem key={sub.url} asChild>
            <Link
              to={sub.url as any}
              className={cn(pathname === sub.url && "bg-accent")}>
              {sub.icon && <sub.icon className="h-3.5 w-3.5" />}
              <span>{sub.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function checkIsActive(pathname: string, item: NavItem): boolean {
  if (item.url) {
    return pathname === item.url;
  }
  if (item.items) {
    return item.items.some((sub) => pathname === sub.url);
  }
  return false;
}

export { checkIsActive };
