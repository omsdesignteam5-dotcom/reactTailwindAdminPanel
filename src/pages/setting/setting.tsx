import React, { useState } from "react";
import { ImageCrop } from "src/components/ui/fileUpload/imageUpload";
import { FileUpload } from "src/components/ui/fileUpload/fileUpload";

export default function Setting() {
  const [singlePreview, setSinglePreview] = useState<string>("");

  return (
    <div className="space-y-8 p-4 text-foreground">
      {/* Single Image Upload */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Single Image Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload one image at a time. Replaces the current image when a new
            one is selected.
          </p>
        </div>
        <ImageCrop
          aspect={1}
          maxSizeMB={5}
          onCroppedImage={(_, previewUrl) => {
            setSinglePreview(previewUrl);
          }}
        />
      </div>

      {/* Multiple Image Upload */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Multiple Image Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload multiple images. Each image is cropped individually and
            displayed as thumbnails.
          </p>
        </div>
        <ImageCrop
          multiple
          aspect={16 / 9}
          maxSizeMB={5}
          onImagesChange={(images) => {
            console.log("All images:", images);
          }}
        />
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">File Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload documents and files. Supports drag-and-drop with file size
            validation.
          </p>
        </div>
        <FileUpload
          multiple
          maxSizeMB={10}
          onFilesChange={(files) => {
            console.log("Uploaded files:", files);
          }}
        />
      </div>
    </div>
  );
}
