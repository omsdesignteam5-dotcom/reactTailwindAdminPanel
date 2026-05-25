import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, Plus, X, Trash2 } from "lucide-react";

import { Button } from "../button/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../modal/modal";
import { cn } from "../../../utils/utils";

interface CroppedImage {
  file: File;
  previewUrl: string;
}

interface ImageCropProps {
  src?: string;
  aspect?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
  onCroppedImage?: (file: File, previewUrl: string) => void;
  onImagesChange?: (images: CroppedImage[]) => void;
}

function createCenteredAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(crop.width * pixelRatio);
  canvas.height = Math.floor(crop.height * pixelRatio);

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );
}

export function ImageCrop({
  src,
  aspect = 1,
  maxSizeMB = 10,
  multiple = false,
  className,
  onCroppedImage,
  onImagesChange,
}: ImageCropProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [error, setError] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  // Seed with initial src if provided
  useEffect(() => {
    if (src && croppedImages.length === 0) {
      setCroppedImages([
        { file: new File([], "initial-image"), previewUrl: src },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const openPicker = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const onSelectFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (file.size > maxBytes) {
        setError("File is too large. Max size is " + maxSizeMB + "MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === "string" ? reader.result : "";
        setPendingImageSrc(value);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setModalOpen(true);
      };
      reader.readAsDataURL(file);

      e.target.value = "";
    },
    [maxBytes, maxSizeMB],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      setError(null);

      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file) return;

      if (file.size > maxBytes) {
        setError("File is too large. Max size is " + maxSizeMB + "MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === "string" ? reader.result : "";
        setPendingImageSrc(value);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setModalOpen(true);
      };
      reader.readAsDataURL(file);
    },
    [maxBytes, maxSizeMB],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setImgEl(e.currentTarget);
      setCrop(createCenteredAspectCrop(width, height, aspect));
    },
    [aspect],
  );

  const onCancelCrop = useCallback(() => {
    setModalOpen(false);
    setPendingImageSrc(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImgEl(null);
  }, []);

  const onConfirmCrop = useCallback(async () => {
    if (
      !imgEl ||
      !completedCrop ||
      completedCrop.width <= 0 ||
      completedCrop.height <= 0
    ) {
      setError("Please select a valid crop area.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvasPreview(imgEl, canvas, completedCrop);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setError("Could not create cropped image.");
      return;
    }

    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(blob);
    objectUrlsRef.current.push(previewUrl);

    const newImage: CroppedImage = { file, previewUrl };

    let updatedImages: CroppedImage[];
    if (multiple) {
      updatedImages = [...croppedImages, newImage];
    } else {
      // Single mode: replace existing
      updatedImages = [newImage];
    }

    setCroppedImages(updatedImages);
    onCroppedImage?.(file, previewUrl);
    onImagesChange?.(updatedImages);

    setModalOpen(false);
    setPendingImageSrc(null);
  }, [completedCrop, imgEl, multiple, croppedImages, onCroppedImage, onImagesChange]);

  const removeImage = useCallback(
    (index: number) => {
      const updated = croppedImages.filter((_, i) => i !== index);
      setCroppedImages(updated);
      onImagesChange?.(updated);
    },
    [croppedImages, onImagesChange],
  );

  const hasImages = croppedImages.length > 0;

  // ── Shared empty-state drop zone ──
  const emptyDropZone = (
    <div
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          isDragOver
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Upload className="h-5 w-5" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragOver
            ? "Drop image here"
            : "Click to upload or drag and drop"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG · Max {maxSizeMB}MB
        </p>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area Container */}
      <div
        className={cn(
          "rounded-lg border-2 border-dashed transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          // Single mode with image: no padding so image fills the box
          !multiple && hasImages ? "p-0 overflow-hidden" : "p-3",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {multiple ? (
          /* ═══ MULTIPLE MODE ═══ */
          hasImages ? (
            <div className="flex flex-wrap items-start gap-3">
              {/* Uploaded image thumbnails */}
              {croppedImages.map((img, index) => (
                <div
                  key={`img-${index}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm"
                >
                  <img
                    src={img.previewUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-destructive"
                    title="Remove image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add more box */}
              <button
                type="button"
                onClick={openPicker}
                className={cn(
                  "flex h-28 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors",
                  "border-border/60 bg-muted/20 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                )}
              >
                <Plus className="h-6 w-6" />
                <span className="text-[10px] font-medium">Add Photo</span>
              </button>
            </div>
          ) : (
            emptyDropZone
          )
        ) : (
          /* ═══ SINGLE MODE ═══ */
          hasImages ? (
            <div className="relative">
              {/* Uploaded image fills the area */}
              <img
                src={croppedImages[0].previewUrl}
                alt="Uploaded"
                className="w-full max-h-64 object-contain bg-muted/20"
              />
              {/* Delete button — always visible top-right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(0);
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-destructive"
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {/* Re-upload overlay at bottom */}
              <button
                type="button"
                onClick={openPicker}
                className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/40 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <Upload className="h-3.5 w-3.5" />
                Change Photo
              </button>
            </div>
          ) : (
            emptyDropZone
          )
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {/* Crop Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent
          className="max-w-2xl"
          showClose={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <ModalHeader>
            <ModalTitle>Crop Image</ModalTitle>
          </ModalHeader>

          <div
            className="overflow-hidden rounded-md border border-border bg-muted/10 select-none"
            style={{ touchAction: "none" }}
          >
            {pendingImageSrc ? (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                keepSelection
              >
                <img
                  src={pendingImageSrc}
                  alt="Crop source"
                  onLoad={onImageLoad}
                  className="max-h-[60vh] w-full object-contain"
                  draggable={false}
                />
              </ReactCrop>
            ) : null}
          </div>

          <ModalFooter className="pt-2">
            <Button variant="outline" type="button" onClick={onCancelCrop}>
              Cancel
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={onConfirmCrop}
              disabled={!completedCrop}
            >
              Crop & Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
