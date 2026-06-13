import React from "react";

// Config
import { imageDisplayUrl } from "src/config/config.json";

// Utils
import { cn } from "src/utils/utils";

// Default placeholder as inline SVG data URI
const defaultPlaceholder =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 70 70">
      <rect fill="#f3f4f6" width="70" height="70"/>
      <text fill="#9ca3af" font-size="10" text-anchor="middle" x="35" y="40">No Image</text>
    </svg>`,
  );

const bannerPlaceholder =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
      <rect fill="#f3f4f6" width="200" height="100"/>
      <text fill="#9ca3af" font-size="12" text-anchor="middle" x="100" y="55">No Banner</text>
    </svg>`,
  );

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  directImage?: string;
  forBanner?: boolean;
}

export const Image = ({
  name,
  directImage,
  className = "img-fluid",
  style = { width: "70px", height: "auto" },
  alt = "image",
  forBanner = false,
  ...rest
}: ImageProps) => {
  console.log(name, "image name");
  const placeholder = forBanner ? bannerPlaceholder : defaultPlaceholder;
  const src = directImage ?? (name ? imageDisplayUrl + name : placeholder);

  return (
    <img
      {...rest}
      src={src}
      className={cn(className)}
      style={forBanner ? undefined : style}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = placeholder;
      }}
    />
  );
};
