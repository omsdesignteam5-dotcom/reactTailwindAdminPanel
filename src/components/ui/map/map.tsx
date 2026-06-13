import {
  forwardRef,
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
  type HTMLAttributes,
} from "react";
import {
  GoogleMap,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";

//Icons
import { Search, MapPin } from "lucide-react";

// Components
import { NewMarker } from "./marker";
import { toast } from "../toast/useToast";

// Context
import { CommonContext } from "../../../context/commonContext";

// Utils
import { cn } from "src/utils/utils";

// Config
import config from "src/config/config.json";

/* ── Types ───────────────────────────────── */
interface UserData {
  lat?: number;
  lng?: number;
  address?: string;
}

interface LocationData {
  lat: number | string;
  lng: number | string;
  address: string;
}

interface StorableLocation {
  country?: string;
  registered_country_iso_code?: string;
  state?: string;
  city?: string;
  route?: string;
}

interface MapProps extends HTMLAttributes<HTMLDivElement> {
  userData: UserData;
  onChangeLocation: (data: LocationData) => void;
}

/* ── Component ───────────────────────────── */
const Map = forwardRef<HTMLDivElement, MapProps>(
  ({ userData, onChangeLocation, className, ...props }, ref) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { languageData } = useContext(CommonContext);

    const { isLoaded, loadError } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: config.GoogleApiKey,
      libraries: ["places"],
    });

    const initialValues: LocationData = {
      lat: "",
      lng: "",
      address: "",
    };

    const [data, setData] = useState<LocationData>(initialValues);
    const [storableLocation, setStorableLocation] = useState<StorableLocation>(
      {},
    );
    const [currentCenter, setCurrentCenter] =
      useState<google.maps.LatLngLiteral>({
        lat: 25.850904,
        lng: 97.4381355,
      });
    const [bounds, setBounds] = useState<google.maps.LatLngBounds | string>("");
    const [mapSearchBox, setMapSearchBox] =
      useState<google.maps.places.SearchBox | null>(null);

    useEffect(() => {
      (async () => {
        try {
          await getLocation();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to get location";
          toast({ description: message, variant: "destructive" });
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData.lat, userData.lng]);

    const getLocation = useCallback(async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lng } }) => {
            const userLocation: google.maps.LatLngLiteral = {
              lat: userData.lat ?? parseFloat(String(lat)),
              lng: userData.lng ?? parseFloat(String(lng)),
            };
            const tempUserData: LocationData = {
              lat: userData.lat ?? parseFloat(String(lat)),
              lng: userData.lng ?? parseFloat(String(lng)),
              address: userData.address ?? "",
            };
            setData(tempUserData);
            setCurrentCenter(userLocation);
          },
          (error) => {
            console.log(error, "Error in retrieve map data");
          },
        );
      }
    }, [userData.lat, userData.lng, userData.address]);

    const getGeoCode = useCallback(
      async (currentLocation: google.maps.LatLngLiteral) => {
        const origin = new window.google.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng,
        );

        const geo = new window.google.maps.Geocoder();
        const storable: StorableLocation = {};

        geo.geocode({ location: origin }, (results, status) => {
          const tempData: LocationData = {
            lat: currentLocation.lat,
            lng: currentLocation.lng,
            address: "",
          };

          if (status === "OK" && results && results[0]) {
            for (
              let ac = results[0].address_components.length - 1;
              ac >= 0;
              ac--
            ) {
              const component = results[0].address_components[ac];
              if (component.types.includes("country")) {
                storable.country = component.long_name;
                storable.registered_country_iso_code = component.short_name;
              } else if (
                component.types.includes("administrative_area_level_1")
              ) {
                storable.state = component.short_name;
              } else if (
                component.types.includes("sublocality") ||
                component.types.includes("locality")
              ) {
                storable.city = component.long_name;
              }
              if (
                component.types.includes("route") ||
                component.types.includes("transit_station")
              ) {
                storable.route = component.long_name;
              }
            }
            tempData.address = [storable.route, storable.state]
              .filter(Boolean)
              .join(" , ");
          } else {
            console.log(
              "Geo code was not successful for the following reason: " + status,
            );
          }

          setData(tempData);
          setStorableLocation(storable);
          onChangeLocation(tempData);
        });
      },
      [onChangeLocation],
    );

    const onPlacesChanged = useCallback(async () => {
      if (!mapSearchBox) return;

      const markerArray: google.maps.LatLng[] = [];
      const results = mapSearchBox.getPlaces();

      if (!results) return;

      for (let i = 0; i < results.length; i++) {
        const place = results[i].geometry?.location;
        if (place) {
          markerArray.push(place);
        }
      }

      if (markerArray.length > 0) {
        const selectLocation: google.maps.LatLngLiteral = {
          lat: markerArray[0].lat(),
          lng: markerArray[0].lng(),
        };

        setCurrentCenter(selectLocation);
        await getGeoCode(selectLocation);
      }
    }, [mapSearchBox, getGeoCode]);

    const onMapLoad = useCallback(async (map: google.maps.Map) => {
      mapRef.current = map;
    }, []);

    const onDragEnd = useCallback(async () => {
      const map = mapRef.current;
      if (!map) return;

      const mapLocation: google.maps.LatLngLiteral = {
        lat: map.getCenter()?.lat() ?? 0,
        lng: map.getCenter()?.lng() ?? 0,
      };
      setBounds(map.getBounds() ?? "");
      setCurrentCenter(mapLocation);
      await getGeoCode(mapLocation);
    }, [getGeoCode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };

    const createMapOptions = (): google.maps.MapOptions => ({
      panControl: false,
      mapTypeControl: false,
      scrollwheel: true,
      clickableIcons: false,
      fullscreenControl: false,
      disableDoubleClickZoom: false,
      gestureHandling: "greedy",
      styles: [
        {
          featureType: "all",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text",
          stylers: [{ visibility: "on" }],
        },
        {
          featureType: "poi",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    /* ── Loading / Error states ──────────── */
    if (loadError) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 p-8 text-center",
            className,
          )}
          {...props}>
          <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">
            Failed to load Google Maps. Please check your API key.
          </p>
        </div>
      );
    }

    if (!isLoaded) {
      return (
        <div ref={ref} className={cn("space-y-3", className)} {...props}>
          <div className="space-y-1">
            <div className="h-9 w-full rounded-md border border-border bg-muted/30 animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-24 bg-muted/30 rounded animate-pulse mb-2" />
            <div className="h-[300px] w-full rounded-lg border border-border bg-muted/30 animate-pulse" />
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {/* ── Search Box ──────────────────── */}
        <div className="space-y-1">
          <StandaloneSearchBox
            onLoad={(ref) => setMapSearchBox(ref)}
            onPlacesChanged={onPlacesChanged}
            bounds={
              bounds instanceof google.maps.LatLngBounds ? bounds : undefined
            }>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                placeholder={
                  languageData.searchYourLocation ?? "Search your location"
                }
                type="text"
                name="address"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm transition-colors",
                  "placeholder:text-muted-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
                value={data.address}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                onChange={handleChange}
              />
            </div>
          </StandaloneSearchBox>
          {data.address === "" && (
            <p className="text-xs text-red-500">
              {languageData.plsEnterAddress ?? "Please enter address"}
            </p>
          )}
        </div>

        {/* ── Map ─────────────────────────── */}
        <div>
          <h5 className="text-sm font-medium text-foreground mb-2">
            {languageData.myLocation ?? "My Location"}
          </h5>
          <GoogleMap
            center={currentCenter}
            zoom={18}
            onLoad={(map) => onMapLoad(map)}
            onDragEnd={onDragEnd}
            mapContainerClassName={cn(
              "rounded-lg border border-border overflow-hidden",
            )}
            mapContainerStyle={{ height: "300px", width: "100%" }}
            options={createMapOptions()}>
            <NewMarker
              shop={{
                lat: currentCenter.lat,
                lng: currentCenter.lng,
                address: data.address,
              }}
              location={currentCenter}
            />
          </GoogleMap>
        </div>
      </div>
    );
  },
);
Map.displayName = "Map";

export { Map };
