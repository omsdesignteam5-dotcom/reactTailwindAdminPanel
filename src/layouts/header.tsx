import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

//Icons
import {
  Menu,
  PanelLeftOpen,
  PanelLeftClose,
  Maximize,
  Minimize,
} from "lucide-react";

//Utils
import { cn } from "src/utils/utils";

//Context
import { useSidebar } from "src/context/sidebarContext";

//Data
import { adminNav } from "src/layouts/_adminNav";

//Component
import { Button } from "src/components/ui/button/button";
import { ThemeSwitch } from "src/components/ui/themeSwtich";
import { Notifications } from "src/components/ui/notification";
import { SettingsDrawer } from "src/components/ui/settingDrawer";
import { Separator } from "src/components/ui/separator/separator";
import { ProfileDropdown } from "src/components/ui/profileDropdown";
import { LanguageDropdown } from "src/components/ui/languageDropdown";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "src/components/ui/tooltip/tooltip";

interface HeaderProps {
  title?: string;
  languages?: [];
}

export function Header({ title, languages = [] }: HeaderProps) {
  const { layout, isOpen, toggle, isMobile } = useSidebar();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(
        (document.body.scrollTop || document.documentElement.scrollTop) > 10,
      );
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const isExpanded = layout === "expanded" || (layout === "full" && isOpen);

  let activeTitle = title;
  if (!activeTitle) {
    const mergedGroups = [
      ...(adminNav.navLinks ? [{ title: "", items: adminNav.navLinks }] : []),
      ...(adminNav.navGroups ?? []),
      ...(adminNav.navItems ?? []).map((entry) =>
        entry.component === "item"
          ? {
              title: "",
              items: [
                {
                  title: entry.title ?? entry.name ?? "",
                  url: entry.url,
                },
              ],
            }
          : {
              title: entry.title ?? entry.name ?? "",
              items: (entry._children ?? []).map((child) => ({
                title: child.title ?? child.name ?? "",
                url: child.url,
              })),
            },
      ),
    ];

    for (const group of mergedGroups) {
      if (activeTitle) break;
      for (const item of group.items) {
        if (item.url === pathname) {
          activeTitle = item.title;
          break;
        }
        if ("items" in item && item.items) {
          const sub = item.items.find((sub) => sub.url === pathname);
          if (sub) {
            activeTitle = sub.title;
            break;
          }
        }
      }
    }
  }

  return (
    <>
      <div className="h-16 shrink-0 transition-all duration-200 ease-in-out" />
      <header
        className={cn(
          "fixed top-0 right-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-lg transition-all duration-200 ease-in-out",
          scrolled && "shadow-sm",
          isMobile || layout === "full"
            ? "left-0"
            : layout === "expanded"
              ? "left-[var(--sidebar-width)]"
              : "left-[var(--sidebar-width-collapsed)]",
        )}>
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-muted-foreground"
              onClick={toggle}>
              {isExpanded ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Page title */}
        {activeTitle && (
          <h1 className="text-sm font-semibold text-foreground truncate ml-2">
            {activeTitle}
          </h1>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          <LanguageDropdown languages={languages} />
          <Notifications />
          <ThemeSwitch />
          <SettingsDrawer />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={toggleFullScreen}>
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle fullscreen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            </TooltipContent>
          </Tooltip>

          <ProfileDropdown />
        </div>
      </header>
    </>
  );
}
