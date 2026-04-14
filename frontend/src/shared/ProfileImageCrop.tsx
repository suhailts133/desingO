import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { CroppedAreaPixels } from "../helpers/cropImageHelper";

type Props = {
  src: string;
  onCropComplete: (croppedAreaPixels: CroppedAreaPixels) => void;
};

export default function ProfileImageCrop({ src, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: CroppedAreaPixels) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      <Cropper
        image={src}
        crop={crop}
        zoom={zoom}
        aspect={1}          
        cropShape="round"   
        showGrid={false}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
        onZoomChange={setZoom}
      />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2/3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
}