import axios from "axios";
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

//Icons
import { Upload, Trash2 } from "lucide-react";

//Components
import { Image } from "src/components/ui/image/image";
import { Button } from "src/components/ui/button/button";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "src/components/ui/modal/modal";
import { useToast } from "src/components/ui/toast/useToast";

//Utils
import { cn, extractImageFileExtensionFromBase64 } from "src/utils/utils";

//Config
import { imageUploadUrl, imageDeleteUrl } from "src/config/config.json";

interface CroppedImage {
  file: File;
  previewUrl: string;
}

interface ImageCropProps {
  value?: string; // Existing server filename (like old JSX props.value)
  src?: string; // Full URL or filename for initial display
  aspect?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
  onCroppedImage?: (file: File, previewUrl: string) => void;
  onImagesChange?: (images: CroppedImage[]) => void;

  // ── Upload / Delete props ──
  getFile?: (fileName: string | null, name?: string, optionId?: string) => void;
  name?: string;
  type?: string;
  optionId?: string;
  allowedExtensions?: string[];
  cancelImgUploading?: boolean;
  uploadedImage?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (success: boolean, fileName?: string) => void;
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
  value,
  src,
  aspect = 1,
  maxSizeMB = 10,
  multiple = false,
  className,
  onCroppedImage,
  onImagesChange,
  // Upload / Delete props
  getFile,
  name,
  type,
  optionId,
  allowedExtensions,
  cancelImgUploading = false,
  uploadedImage: propUploadedImage,
  onUploadStart,
  onUploadComplete,
}: ImageCropProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [error, setError] = useState<string | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const [croppedImages, setCroppedImages] = useState<CroppedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [serverImage, setServerImage] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const latestCroppedFileRef = useRef<File | null>(null);

  const { toast } = useToast();

  const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  // Sync with external value (like old JSX props.value)
  useEffect(() => {
    const val = value ?? propUploadedImage ?? "";
    if (val) {
      setServerImage(val);
    }
  }, [value, propUploadedImage]);

  // Seed with initial src if provided (must be a full URL)
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

  const removeImage = useCallback(
    (index: number) => {
      const updated = croppedImages.filter((_, i) => i !== index);
      setCroppedImages(updated);
      onImagesChange?.(updated);
    },
    [croppedImages, onImagesChange],
  );

  // ── Convert File to base64 ──
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // ── Upload image to server ──
  const imageUpload = useCallback(async () => {
    if (!getFile) {
      console.warn("ImageCrop: getFile prop is required for upload");
      return;
    }

    const file = latestCroppedFileRef.current;
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No cropped image available. Please crop the image first.",
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    onUploadStart?.();

    try {
      // 1. Convert file to base64 to check extension
      const croppedBase64 = await fileToBase64(file);

      // 2. Check extension
      const imageFileExtension =
        extractImageFileExtensionFromBase64(croppedBase64);
      if (
        allowedExtensions &&
        !allowedExtensions.includes(imageFileExtension)
      ) {
        const errorMsg = `Allow extensions are ${allowedExtensions.join(", ")}`;
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
          position: "top-right",
          duration: 3000,
        });
        setIsUploading(false);
        return;
      }

      // 3. Build FormData and upload using the File directly
      const formData = new FormData();
      formData.append("myFile", file, file.name);
      formData.append("type", type ?? "");

      const response = await axios.post(imageUploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const loaded = cancelImgUploading ? 0 : progressEvent.loaded;
          const total = cancelImgUploading ? 0 : (progressEvent.total ?? 0);
          const percentage = total ? Math.round((loaded * 100) / total) : 0;
          setUploadProgress(percentage);
        },
      });

      console.log("Upload response:", response.data);

      if (response.data.result) {
        setServerImage(response.data.name);
        getFile(response.data.name, name, optionId);
        setUploadProgress(0);
        toast({
          variant: "success",
          title: "Success",
          description: "Image uploaded successfully",
          position: "top-right",
          duration: 3000,
        });
        onUploadComplete?.(true, response.data.name);
      } else {
        setUploadError(response.data.message ?? "Upload failed");
        getFile(null, name, optionId);
        setUploadProgress(0);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message ?? "Upload failed",
          position: "top-right",
          duration: 3000,
        });
        onUploadComplete?.(false);
      }
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Upload failed";
      setUploadError(msg);
      toast({
        variant: "destructive",
        title: "Error",
        description: msg,
        position: "top-right",
        duration: 3000,
      });
      onUploadComplete?.(false);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [
    getFile,
    fileToBase64,
    allowedExtensions,
    type,
    name,
    optionId,
    cancelImgUploading,
    toast,
    onUploadStart,
    onUploadComplete,
  ]);

  // ── Delete image from server ──
  const deleteImage = useCallback(async () => {
    if (!getFile) {
      console.warn("ImageCrop: getFile prop is required for delete");
      return;
    }

    if (!serverImage) {
      // No server image name — just clear local state
      removeImage(0);
      return;
    }

    try {
      const config = { imageName: serverImage };
      const response = await axios.post(imageDeleteUrl, config);

      if (response.data.result) {
        setServerImage("");
        getFile("");
        setUploadProgress(0);
        removeImage(0);
        toast({
          variant: "success",
          title: "Success",
          description: "Image deleted successfully",
          position: "top-right",
          duration: 3000,
        });
      }
    } catch (error: unknown) {
      console.error("Delete image error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
        position: "top-right",
        duration: 3000,
      });
    }
  }, [getFile, serverImage, removeImage, toast]);

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

    // Store the file in ref for upload
    latestCroppedFileRef.current = file;

    // Auto-upload after crop (like old JSX "Yes" button)
    setTimeout(() => {
      void imageUpload();
    }, 100);
  }, [
    completedCrop,
    imgEl,
    multiple,
    croppedImages,
    onCroppedImage,
    onImagesChange,
    imageUpload,
  ]);

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
      className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          isDragOver
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}>
        <Upload className="h-5 w-5" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {isDragOver ? "Drop image here" : "Click to upload or drag and drop"}
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
          serverImage ? "p-0 overflow-hidden" : "p-3",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}>
        {serverImage ? (
          /* ═══ IMAGE EXISTS — show with delete (like old JSX) ═══ */
          <div className="relative">
            <Image
              name={serverImage}
              alt="Uploaded"
              className="w-full max-h-64 object-contain bg-muted/20"
              style={{ width: "100%", height: "auto" }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void deleteImage();
              }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-destructive"
              title="Remove image">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={openPicker}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-black/40 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/60">
              <Upload className="h-3.5 w-3.5" />
              Change Photo
            </button>
          </div>
        ) : isUploading ? (
          /* ═══ UPLOADING — show progress ═══ */
          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
          </div>
        ) : (
          /* ═══ NO IMAGE — show empty drop zone ═══ */
          emptyDropZone
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
      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}

      {/* Crop Modal */}
      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent
          className="max-w-2xl"
          showClose={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}>
          <ModalHeader>
            <ModalTitle>Crop Image</ModalTitle>
          </ModalHeader>

          <div
            className="overflow-hidden rounded-md border border-border bg-muted/10 select-none"
            style={{ touchAction: "none" }}>
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
              disabled={!completedCrop || isUploading}>
              {isUploading ? `Uploading...` : "Upload"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
