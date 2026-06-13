import { useContext, useEffect } from "react";

// Icons
import { Command } from "lucide-react";

// Utils
import { cn } from "src/utils/utils";

// Components
import { SidebarNav } from "src/layouts/sidebarNav";
import { ScrollArea } from "src/components/ui/scrollArea/scrollArea";
import { Sheet, SheetContent, SheetTitle } from "src/components/ui/sheet/sheet";

// Context
import { useTheme } from "src/context/themeContext";
import CommonContext from "src/context/commonContext";
import { useSidebar, type SidebarTheme } from "src/context/sidebarContext";

// Nav Data
import { adminNav } from "src/layouts/_adminNav";
import type {
  NavCollapsible,
  NavEntryItem,
  NavGroup,
  NavItem,
  NavLink,
} from "src/layouts/sidebarTypes";

export const SIDEBAR_THEME_CLASSES: Record<SidebarTheme, string> = {
  default:
    "bg-slate-900 text-slate-100 border-slate-800 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]",
  green:
    "bg-emerald-700 text-white border-emerald-600 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
  cyan: "bg-cyan-700 text-white border-cyan-600 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
  violet:
    "bg-violet-800 text-white border-violet-700 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
  amber:
    "bg-amber-700 text-white border-amber-600 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
  frost:
    "bg-slate-800 text-slate-100 border-slate-700 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]",
};

const isNavEntryItem = (entry: unknown): entry is NavEntryItem => {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "component" in entry &&
    (entry as { component?: string }).component === "item" &&
    "url" in entry &&
    typeof (entry as { url?: unknown }).url === "string"
  );
};

export function Sidebar() {
  const { layout, isOpen, isMobile, setOpen, sidebarTheme, setSidebarTheme } =
    useSidebar();
  const { resolvedTheme } = useTheme();
  const { languageData } = useContext(CommonContext);

  useEffect(() => {
    setSidebarTheme(resolvedTheme === "light" ? "frost" : "default");
  }, [resolvedTheme, setSidebarTheme]);

  const navItemsAsGroups: NavGroup[] = (adminNav.navItems ?? []).map(
    (entry): NavGroup => {
      if (isNavEntryItem(entry)) {
        return {
          title: "",
          items: [
            {
              title: languageData[entry.name ?? ""],
              name: entry.name,
              url: entry.url,
              icon: entry.icon,
              badge: entry.badge,
            },
          ],
        };
      }

      const children: NavLink[] = (entry._children ?? []).map((child) => ({
        title: languageData[child.name ?? ""] ?? child.name ?? "",
        name: child.name,
        url: child.url,
        icon: child.icon,
        badge: child.badge,
      }));

      const groupItem: NavCollapsible = {
        title: languageData[entry.name ?? ""],
        name: entry.name,
        url: entry.url,
        icon: entry.icon,
        badge: entry.badge,
        items: children,
      };

      return {
        title: "",
        items: [groupItem],
      };
    },
  );

  const groups: NavGroup[] = [
    ...(adminNav.navLinks
      ? [
          {
            title: "",
            items: adminNav.navLinks.map((item) =>
              "items" in item && item.items
                ? {
                    ...item,
                    title: languageData[item.name ?? ""],
                    items: item.items.map((sub) => ({
                      ...sub,
                      title: languageData[sub.name ?? ""],
                    })),
                  }
                : {
                    ...item,
                    title: languageData[item.name ?? ""],
                  },
            ),
          },
        ]
      : []),
    ...navItemsAsGroups.map((group) => ({
      ...group,
      title: "",
    })),
  ];

  if (isMobile || layout === "full") {
    return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className={cn(
            "w-[var(--sidebar-width)] max-w-[85vw] p-0 border-r",
            "backdrop-blur-sm",
            SIDEBAR_THEME_CLASSES[sidebarTheme],
          )}>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex h-full flex-col">
            <SidebarHeader expanded />
            <ScrollArea className="flex-1 px-2 py-2">
              <SidebarNav groups={groups} />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const isExpanded = layout === "expanded";

  return (
    <>
      <div
        className={cn(
          "shrink-0 transition-[width] duration-200 ease-in-out",
          isExpanded
            ? "w-[var(--sidebar-width)]"
            : "w-[var(--sidebar-width-collapsed)]",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r",
          "transition-[width] duration-200 ease-in-out",
          "supports-[backdrop-filter]:backdrop-blur-sm",
          SIDEBAR_THEME_CLASSES[sidebarTheme],
          isExpanded
            ? "w-[var(--sidebar-width)]"
            : "w-[var(--sidebar-width-collapsed)]",
        )}>
        <SidebarHeader expanded={isExpanded} />

        <ScrollArea className="flex-1 px-2 py-2">
          <SidebarNav groups={groups} />
        </ScrollArea>

        <div
          className={cn(
            "border-t px-3 py-2 text-[11px] leading-none border-white/10",
            isExpanded ? "opacity-80" : "opacity-0 pointer-events-none",
          )}>
          Version 1.0
        </div>
      </aside>
    </>
  );
}

function SidebarHeader({ expanded }: { expanded: boolean }) {
  return (
    <div
      className={cn(
        "h-16 border-b border-white/10 px-3",
        "flex items-center overflow-hidden",
      )}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <Command className="h-5 w-5" />
      </div>

      <div
        className={cn(
          "ml-3 flex min-w-0 flex-col transition-all duration-200",
          expanded
            ? "max-w-[calc(var(--sidebar-width)-6.25rem)] opacity-100 translate-x-0"
            : "max-w-0 opacity-0 -translate-x-2",
        )}>
        <span className="truncate text-base font-semibold tracking-tight text-white">
          Admin Panel
        </span>
        <span className="truncate text-xs text-slate-300">Dashboard</span>
      </div>
    </div>
  );
}
