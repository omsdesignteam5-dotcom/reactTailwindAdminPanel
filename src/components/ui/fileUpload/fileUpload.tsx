import {
  useCallback,
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";

//Icons
import { Upload, X, File as FileIcon, Image as ImageIcon, FileText, FileSpreadsheet, FileArchive } from "lucide-react";

//Utils
import { cn } from "../../../utils/utils";

//Components
import { Button } from "../button/button";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

interface FileWithPreview {
  file: File;
  previewUrl?: string;
}

function getFileIcon(file: File) {
  const type = file.type;
  if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  if (type === "application/pdf" || type.includes("document")) return <FileText className="h-4 w-4" />;
  if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) return <FileSpreadsheet className="h-4 w-4" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar") || type.includes("archive")) return <FileArchive className="h-4 w-4" />;
  return <FileIcon className="h-4 w-4" />;
}

export function FileUpload({
  accept,
  multiple = false,
  maxSizeMB = 10,
  onFilesChange,
  className,
  disabled = false,
}: FileUploadProps) {
  const [fileItems, setFileItems] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFiles = useCallback(
    (fileList: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const fileArray = Array.from(fileList);

      for (const file of fileArray) {
        if (file.size > maxSizeBytes) {
          setError(`"${file.name}" exceeds the ${maxSizeMB}MB size limit.`);
          continue;
        }
        validFiles.push(file);
      }

      return validFiles;
    },
    [maxSizeBytes, maxSizeMB],
  );

  const createPreviews = useCallback((files: File[]): FileWithPreview[] => {
    return files.map((file) => {
      const item: FileWithPreview = { file };
      if (file.type.startsWith("image/")) {
        item.previewUrl = URL.createObjectURL(file);
      }
      return item;
    });
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const validFiles = validateFiles(fileList);
      if (validFiles.length === 0) return;

      const newPreviews = createPreviews(validFiles);

      let updatedItems: FileWithPreview[];
      if (multiple) {
        updatedItems = [...fileItems, ...newPreviews];
      } else {
        // Single mode: revoke old preview
        fileItems.forEach((item) => {
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        updatedItems = newPreviews.slice(0, 1);
      }

      setFileItems(updatedItems);
      onFilesChange?.(updatedItems.map((item) => item.file));
    },
    [fileItems, multiple, onFilesChange, validateFiles, createPreviews],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    },
    [handleFiles],
  );

  const removeFile = useCallback(
    (index: number) => {
      const removed = fileItems[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);

      const newItems = fileItems.filter((_, i) => i !== index);
      setFileItems(newItems);
      onFilesChange?.(newItems.map((item) => item.file));
    },
    [fileItems, onFilesChange],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasFiles = fileItems.length > 0;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
          hasFiles ? "min-h-[80px]" : "min-h-[150px]",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "cursor-not-allowed opacity-50",
        )}>
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
            {isDragOver
              ? "Drop files here"
              : hasFiles
                ? "Click to add more files"
                : "Click to upload or drag and drop"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {accept ? `Accepted: ${accept}` : "Any file type"} · Max {maxSizeMB}
            MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* File List */}
      {hasFiles && (
        <div className="space-y-2">
          {fileItems.map((item, index) => (
            <div
              key={`${item.file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/30">
              {/* File icon or image preview */}
              {item.previewUrl ? (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {getFileIcon(item.file)}
                </div>
              )}
              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(item.file.size)}
                </p>
              </div>
              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
