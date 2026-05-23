import React, { useState } from "react";
import { ImageCrop } from "../../components/ui/fileUpload/imageUpload";

export default function Setting() {
  const [preview, setPreview] = useState<string>("");

  return (
    <div className="space-y-4 p-4 text-foreground">
      <h2 className="text-lg font-semibold">Image Crop Demo</h2>

      <ImageCrop
        aspect={1}
        maxSizeMB={5}
        onCroppedImage={(_, previewUrl) => {
          setPreview(previewUrl);
        }}
      />
    </div>
  );
}
