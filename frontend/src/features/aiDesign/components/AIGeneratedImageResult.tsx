import { Download } from "lucide-react";
import type { GeneratedDesignImage } from "../aiDesignInterface";

interface AIGeneratedImageResultProps {
  image: GeneratedDesignImage;
}

export default function AIGeneratedImageResult({ image, }: AIGeneratedImageResultProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = `ai-design-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="mt-4 space-y-3">
      <img
        src={image.dataUrl}
        alt="AI generated interior design"
        className="w-full rounded-lg border border-surface-border"
      />

      <button
        type="button"
        onClick={handleDownload}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface border border-surface-border text-text-muted hover:bg-surface-hover hover:border-surface-border-strong hover:text-text-primary py-2 text-sm font-medium transition-colors"
      >
        <Download size={16} />
        Download
      </button>
    </div>
  );
}