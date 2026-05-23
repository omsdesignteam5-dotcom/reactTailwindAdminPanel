import { useEffect, useState } from "react";

//Icons
import { Command } from "lucide-react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // We'll use this component in root, so it will show up on every mount of the root route
    // But typically we only want it strictly on the VERY first load.
    // However, TanStack Router root stays mounted.
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-[#090909]">
      <div className="relative flex flex-col items-center">
        <div className="relative mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl">
          <Command className="h-8 w-8" />
        </div>

        <div className="flex gap-1.5">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
