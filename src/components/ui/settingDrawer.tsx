//Icons
import {
  Settings,
  Monitor,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";

//Utils
import { cn } from "../../utils/utils";

//Components
import { Button } from "./button/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet/sheet";

//Context
import { useTheme } from "../../context/themeContext";
import { useSidebar } from "../../context/sidebarContext";

export function SettingsDrawer() {
  const { resetTheme } = useTheme();
  const { setLayout, setSidebarTheme } = useSidebar();

  const handleReset = () => {
    setLayout("expanded");
    setSidebarTheme("default");
    resetTheme();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Open settings">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col" side="right">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
          <ThemeConfig />
          <PrimaryColorConfig />
          <LayoutConfig />
          <SidebarThemeConfig />
        </div>
        <SheetFooter>
          <Button
            variant="destructive"
            onClick={handleReset}
            className="w-full">
            Reset to Defaults
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 text-sm font-semibold text-muted-foreground">
      {title}
    </div>
  );
}

function ThemeConfig() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light" as const, label: "Light", icon: Sun },
    { value: "dark" as const, label: "Dark", icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <div>
      <SectionTitle title="Theme" />
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
              theme === opt.value
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-accent/50",
            )}>
            <opt.icon className="h-5 w-5" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LayoutConfig() {
  const { layout, setLayout } = useSidebar();

  const options = [
    { value: "expanded" as const, label: "Expanded", icon: PanelLeft },
    { value: "compact" as const, label: "Compact", icon: PanelLeftClose },
    { value: "full" as const, label: "Full", icon: PanelLeftClose },
  ];

  return (
    <div>
      <SectionTitle title="Layout" />
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setLayout(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
              layout === opt.value
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-accent/50",
            )}>
            <opt.icon className="h-5 w-5" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SidebarThemeConfig() {
  const { sidebarTheme, setSidebarTheme } = useSidebar();

  const options = [
    {
      value: "default" as const,
      label: "Default",
      color: "bg-stone-200 dark:bg-stone-800",
      activeBorder: "border-primary",
    },
    {
      value: "green" as const,
      label: "Green",
      color: "bg-emerald-500",
      activeBorder: "border-emerald-500",
    },
    {
      value: "cyan" as const,
      label: "Cyan",
      color: "bg-cyan-500",
      activeBorder: "border-cyan-500",
    },
    {
      value: "violet" as const,
      label: "Violet",
      color: "bg-violet-500",
      activeBorder: "border-violet-500",
    },
    {
      value: "amber" as const,
      label: "Amber",
      color: "bg-amber-500",
      activeBorder: "border-amber-500",
    },
    {
      value: "frost" as const,
      label: "Frost",
      color: "bg-slate-500",
      activeBorder: "border-slate-500",
    },
  ];

  return (
    <div>
      <SectionTitle title="Sidebar Theme" />
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = sidebarTheme === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSidebarTheme(opt.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors",
                isActive
                  ? cn(
                      "border-primary bg-accent text-accent-foreground",
                      opt.activeBorder,
                    )
                  : "border-border text-muted-foreground hover:bg-accent/50",
              )}>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-4 h-4 ring-offset-2 ring-offset-background",
                  isActive ? cn("ring-2", opt.activeBorder) : "",
                  opt.color,
                )}>
                {isActive && (
                  <div
                    className={cn(
                      "rounded-full w-1.5 h-1.5",
                      opt.activeBorder,
                      opt.color,
                    )}
                  />
                )}
              </div>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PrimaryColorConfig() {
  const { primaryColor, setPrimaryColor } = useTheme();

  const options = [
    { value: "default" as const, label: "Default", color: "bg-primary" },
    { value: "purple" as const, label: "Purple", color: "bg-purple-600" },
    { value: "blue" as const, label: "Blue", color: "bg-blue-600" },
    { value: "green" as const, label: "Green", color: "bg-emerald-500" },
    { value: "orange" as const, label: "Orange", color: "bg-orange-500" },
  ];

  return (
    <div>
      <SectionTitle title="Primary Color" />
      <div className="grid grid-cols-5 gap-2">
        {options.map((opt) => {
          const isActive = primaryColor === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setPrimaryColor(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition-colors",
                isActive
                  ? "border-primary bg-accent/20"
                  : "border-border text-muted-foreground hover:bg-accent/50",
              )}>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-4 h-4 ring-offset-1 ring-offset-background",
                  isActive ? "ring-1 ring-primary" : "",
                  opt.value === "default"
                    ? "bg-slate-900 dark:bg-slate-100"
                    : opt.color,
                )}>
                {isActive && (
                  <div
                    className={cn(
                      "rounded-full w-1.5 h-1.5",
                      opt.value === "default"
                        ? "bg-slate-900 dark:bg-slate-100"
                        : opt.color,
                    )}
                  />
                )}
              </div>
              <span className="truncate w-full text-center">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
