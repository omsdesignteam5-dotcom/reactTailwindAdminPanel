import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = Exclude<Theme, "system">;
export type PrimaryColor = "default" | "purple" | "blue" | "green" | "orange";

const STORAGE_KEY = "admin-ui-theme";
const COLOR_STORAGE_KEY = "admin-ui-primary-color";
const DEFAULT_THEME: Theme = "system";
const DEFAULT_COLOR: PrimaryColor = "default";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  defaultTheme: Theme;
  resolvedTheme: ResolvedTheme;
  theme: Theme;
  primaryColor: PrimaryColor;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  resetTheme: () => void;
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: "light",
  theme: DEFAULT_THEME,
  primaryColor: DEFAULT_COLOR,
  setTheme: () => null,
  setPrimaryColor: () => null,
  resetTheme: () => null,
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [primaryColor, _setPrimaryColor] = useState<PrimaryColor>(
    () =>
      (localStorage.getItem(COLOR_STORAGE_KEY) as PrimaryColor) ||
      DEFAULT_COLOR,
  );

  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme as ResolvedTheme;
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (resolved: ResolvedTheme) => {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    };

    const handleChange = () => {
      if (theme === "system") {
        applyTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    applyTheme(resolvedTheme);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const themeClasses = [
      "theme-purple",
      "theme-blue",
      "theme-green",
      "theme-orange",
    ];
    root.classList.remove(...themeClasses);
    if (primaryColor !== "default") {
      root.classList.add(`theme-${primaryColor}`);
    }
  }, [primaryColor]);

  const setTheme = (t: Theme) => {
    localStorage.setItem(storageKey, t);
    _setTheme(t);
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    localStorage.setItem(COLOR_STORAGE_KEY, color);
    _setPrimaryColor(color);
  };

  const resetTheme = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(COLOR_STORAGE_KEY);
    _setTheme(DEFAULT_THEME);
    _setPrimaryColor(DEFAULT_COLOR);
  };

  const contextValue: ThemeProviderState = {
    defaultTheme,
    resolvedTheme,
    theme,
    primaryColor,
    setTheme,
    setPrimaryColor,
    resetTheme,
  };

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
