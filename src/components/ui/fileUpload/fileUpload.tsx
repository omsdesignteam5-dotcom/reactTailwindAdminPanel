import {
  useCallback,
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";

//Icons
import { Upload, X, File as FileIcon } from "lucide-react";

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

export function FileUpload({
  accept,
  multiple = false,
  maxSizeMB = 10,
  onFilesChange,
  className,
  disabled = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
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

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const validFiles = validateFiles(fileList);
      const newFiles = multiple
        ? [...files, ...validFiles]
        : validFiles.slice(0, 1);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [files, multiple, onFilesChange, validateFiles],
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
      }
    },
    [handleFiles],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [files, onFilesChange],
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
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
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-muted-foreground">
                <FileIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
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
