import { useState } from "react";
import { MapPin } from "lucide-react";

// Components
import { Map } from "src/components/ui/map/map";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "src/components/ui/card/card";

//Utils
import { cn } from "src/utils/utils";

/* ── Types ───────────────────────────────── */
interface LocationInfo {
  lat: number | string;
  lng: number | string;
  address: string;
}

/* ── Page ────────────────────────────────── */
export default function SampleMap() {
  const [location, setLocation] = useState<LocationInfo>({
    lat: "",
    lng: "",
    address: "",
  });

  return (
    <div className={cn("p-6")}>
      <Card>
        <CardHeader>
          <CardTitle className={cn("flex items-center gap-2")}>
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Map Sample
          </CardTitle>
        </CardHeader>
        <CardContent className={cn("space-y-4")}>
          <Map userData={{}} onChangeLocation={(data) => setLocation(data)} />

          {/* ── Location details ────────────── */}
          <div
            className={cn(
              "rounded-lg border border-border bg-muted/50 p-4 space-y-2",
            )}>
            <h4 className={cn("text-sm font-medium text-foreground")}>
              Selected Location
            </h4>
            <div
              className={cn(
                "grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm",
              )}>
              {location.address && (
                <>
                  <span className={cn("text-muted-foreground")}>Address</span>
                  <span className={cn("text-foreground")}>
                    {location.address}
                  </span>
                </>
              )}
              {location.lat !== "" && (
                <>
                  <span className={cn("text-muted-foreground")}>Latitude</span>
                  <span className={cn("text-foreground font-mono")}>
                    {location.lat}
                  </span>
                </>
              )}
              {location.lng !== "" && (
                <>
                  <span className={cn("text-muted-foreground")}>Longitude</span>
                  <span className={cn("text-foreground font-mono")}>
                    {location.lng}
                  </span>
                </>
              )}
              {location.lat === "" && location.address === "" && (
                <span className={cn("text-muted-foreground italic col-span-2")}>
                  Search for a location or drag the map to see coordinates
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
