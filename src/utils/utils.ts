import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract file extension from a base64 data URI string.
 * e.g. "data:image/png;base64,..." → "png"
 */
export function extractImageFileExtensionFromBase64(
  base64Data: string,
): string {
  const match = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
  return match ? match[1] : "jpg";
}

/**
 * Convert a base64 data URI string to a File object.
 */
export function base64StringToFile(
  base64String: string,
  fileName: string,
): File {
  const arr = base64String.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
}
