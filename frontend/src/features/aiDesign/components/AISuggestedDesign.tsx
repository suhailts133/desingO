import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DesignGallaryDTO } from "../../common/commonInterface";

interface Props {
  designs: DesignGallaryDTO[];
  isLoading?: boolean;
}

export default function AISuggestedDesigns({ designs, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-surface-hover border border-surface-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!designs.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-xs font-semibold text-text-primary tracking-wide">
        You might also like
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {designs.map((item) => (
          <div
            key={item.designId}
            onClick={() => navigate(`/designs/${item.designId}`)}
            className="group relative aspect-square rounded-lg overflow-hidden border border-surface-border cursor-pointer bg-surface transition-all duration-300 ease-out hover:border-accent"
          >
            <img
              src={item.coverImage}
              alt="Suggested design"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-1 right-1 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
              <div className="w-5 h-5 rounded-full bg-surface border border-surface-border flex items-center justify-center">
                <ArrowUpRight size={10} className="text-text-primary group-hover:text-accent transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}