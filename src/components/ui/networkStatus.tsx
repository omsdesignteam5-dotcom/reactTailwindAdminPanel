import { useEffect, useState } from "react";

//Icons
import { WifiOff, RefreshCcw } from "lucide-react";

//Components
import { Button } from "./button/button";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  // Prevents clicking underneath
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md text-center">
      <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
        <div className="rounded-full bg-destructive/10 p-5">
          <WifiOff className="h-12 w-12 text-destructive" />
        </div>
        <div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
            No Internet Connection
          </h2>
          <p className="mt-2 text-muted-foreground max-w-[500px]">
            Please check your network settings and make sure you are online. The
            app will automatically resume once the connection is restored.
          </p>
        </div>
        <Button
          className="mt-6"
          size="lg"
          onClick={() => window.location.reload()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
