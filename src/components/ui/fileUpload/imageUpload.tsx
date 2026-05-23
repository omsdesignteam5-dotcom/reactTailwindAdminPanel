import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload } from "lucide-react";

import { Button } from "../button/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../modal/modal";
import { cn } from "../../../utils/utils";

interface ImageCropProps {
  src?: string;
  aspect?: number;
  maxSizeMB?: number;
  className?: string;
  onCroppedImage?: (file: File, previewUrl: string) => void;
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
  className,
  onCroppedImage,
}: ImageCropProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [error, setError] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string>(src ?? "");

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  useEffect(() => {
    if (src) setCroppedPreview(src);
  }, [src]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
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

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    objectUrlRef.current = previewUrl;

    setCroppedPreview(previewUrl);
    onCroppedImage?.(file, previewUrl);

    setModalOpen(false);
    setPendingImageSrc(null);
  }, [completedCrop, imgEl, onCroppedImage]);

  return (
    <div className={cn("space-y-4", className)}>
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
        className={cn(
          "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-muted/40 px-6 py-8 text-center",
          "transition-colors hover:bg-muted/60",
        )}>
        <Upload className="mb-3 h-10 w-10 text-blue-500" />
        <p className="text-xl font-medium text-foreground">
          Browse Files to upload
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="hidden"
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {croppedPreview ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Cropped image</p>
          <img
            src={croppedPreview}
            alt="Cropped preview"
            className="max-h-72 w-auto rounded-md border border-border object-contain"
          />
        </div>
      ) : null}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-w-2xl" showClose={false}>
          <ModalHeader>
            <ModalTitle>Crop image</ModalTitle>
          </ModalHeader>

          {pendingImageSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              keepSelection>
              <img
                src={pendingImageSrc}
                alt="Crop source"
                onLoad={onImageLoad}
                className="max-h-[60vh] w-full object-contain"
              />
            </ReactCrop>
          ) : null}

          <ModalFooter>
            <Button variant="secondary" type="button" onClick={onCancelCrop}>
              No
            </Button>
            <Button
              variant="default"
              type="button"
              onClick={onConfirmCrop}
              disabled={!completedCrop}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
