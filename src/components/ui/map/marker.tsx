import { useState } from "react";
import { MarkerF, InfoWindow } from "@react-google-maps/api";

// Services
import { getLocalStorageCurrentShopRoute } from "../../../services/localStorage";

//Utils
import { cn } from "src/utils/utils";

/* ── Types ───────────────────────────────── */
interface Shop {
  lat: number;
  lng: number;
  address: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface NewMarkerProps {
  shop: Shop | null;
  location: Location;
}

/* ── Component ───────────────────────────── */
const NewMarker = ({ shop, location }: NewMarkerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const shopRoute = getLocalStorageCurrentShopRoute();

  if (!shop) return null;

  return (
    <MarkerF position={location} onClick={() => setIsOpen(true)}>
      {isOpen && (
        <InfoWindow onCloseClick={() => setIsOpen(false)}>
          <div className={cn("px-1 py-0.5")}>
            {shopRoute && (
              <h5 className={cn("text-sm font-semibold leading-tight mb-0.5")}>
                {shopRoute}
              </h5>
            )}
            <p className={cn("text-xs text-muted-foreground")}>
              {shop.address}
            </p>
          </div>
        </InfoWindow>
      )}
    </MarkerF>
  );
};

NewMarker.displayName = "NewMarker";

export { NewMarker };
