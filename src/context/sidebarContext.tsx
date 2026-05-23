import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "admin-sidebar-state";
const MOBILE_BREAKPOINT = 768;

export type SidebarLayout = "expanded" | "compact" | "full";
export type SidebarTheme =
  | "default"
  | "green"
  | "cyan"
  | "violet"
  | "amber"
  | "frost";

interface SidebarProviderState {
  layout: SidebarLayout;
  setLayout: (layout: SidebarLayout) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
  toggle: () => void;
  sidebarTheme: SidebarTheme;
  setSidebarTheme: (theme: SidebarTheme) => void;
}

const SidebarContext = createContext<SidebarProviderState | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  defaultLayout?: SidebarLayout;
}

export function SidebarProvider({
  children,
  defaultLayout = "expanded",
}: SidebarProviderProps) {
  const [layout, _setLayout] = useState<SidebarLayout>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "expanded" || stored === "compact" || stored === "full") {
      return stored as SidebarLayout;
    }
    return defaultLayout;
  });

  const [sidebarTheme, setSidebarThemeState] = useState<SidebarTheme>(() => {
    const stored = localStorage.getItem("admin-sidebar-theme");
    if (
      ["default", "green", "cyan", "violet", "amber", "frost"].includes(
        stored as string,
      )
    ) {
      return stored as SidebarTheme;
    }
    return "default";
  });

  const [isOpen, setIsOpen] = useState(false); // For mobile or 'full' mode overlay
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const setLayout = useCallback(
    (newLayout: SidebarLayout) => {
      _setLayout(newLayout);
      if (!isMobile) {
        localStorage.setItem(STORAGE_KEY, newLayout);
      }
    },
    [isMobile],
  );

  const setSidebarTheme = useCallback((theme: SidebarTheme) => {
    setSidebarThemeState(theme);
    localStorage.setItem("admin-sidebar-theme", theme);
  }, []);

  const toggle = useCallback(() => {
    if (isMobile || layout === "full") {
      setIsOpen((prev) => !prev);
    } else {
      setLayout(layout === "expanded" ? "compact" : "expanded");
    }
  }, [isMobile, layout, setLayout]);

  return (
    <SidebarContext
      value={{
        layout,
        setLayout,
        isOpen,
        setOpen: setIsOpen,
        isMobile,
        toggle,
        sidebarTheme,
        setSidebarTheme,
      }}>
      {children}
    </SidebarContext>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}
