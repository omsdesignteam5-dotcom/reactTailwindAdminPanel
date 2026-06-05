import { useEffect } from "react";

//Icons
import { Check, Moon, Sun, Monitor } from "lucide-react";

//Utils
import { cn } from "src/utils/utils";

//Components
import { Button } from "src/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown/dropdownMenu";

//Context
import { useTheme } from "src/context/themeContext";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const themeColor = theme === "dark" ? "#020817" : "#fff";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);

  const themes = [
    { id: 1, name: "light", icon: <Sun className="mr-2 h-4 w-4" /> },
    { id: 2, name: "dark", icon: <Moon className="mr-2 h-4 w-4" /> },
    { id: 3, name: "system", icon: <Monitor className="mr-2 h-4 w-4" /> },
  ] as const;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => (
          <DropdownMenuItem onClick={() => setTheme(item.name)} key={item.id}>
            {item.icon}
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            <Check
              size={14}
              className={cn("ml-auto", theme !== item.name && "hidden")}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
