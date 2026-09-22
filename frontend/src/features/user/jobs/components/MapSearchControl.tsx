import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

interface SearchResult {
  x: number;
  y: number;
  label: string;
}

interface MapSearchControlProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export default function MapSearchControl({ onSelectLocation }: MapSearchControlProps) {
  const map = useMap();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const provider = useMemo(() => new OpenStreetMapProvider(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);
  }, []);

  const handlePick = (result: SearchResult) => {
    onSelectLocation(result.y, result.x);
    map.setView([result.y, result.x], 13);
    setResults([]);
    setQuery(result.label);
  };

  const runSearch = async () => {
    if (!query.trim()) return;

    try {
      const searchResults = (await provider.search({ query })) as SearchResult[];
      setResults(searchResults);
      if (searchResults.length > 0) handlePick(searchResults[0]);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void runSearch();
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-2.5 left-12 z-1000 bg-surface border border-surface-border rounded-md p-2"
    >
      <div className="flex gap-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="px-2 py-1 w-52 text-sm bg-surface-hover border border-surface-border text-text-primary placeholder-text-faint focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none rounded"
        />
        <button
          type="button"
          onClick={() => void runSearch()}
          className="px-2 py-1 text-sm bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active rounded"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-2 max-h-36 overflow-y-auto text-xs">
          {results.map((item) => (
            <li
              key={`${item.y}-${item.x}`}
              onClick={() => handlePick(item)}
              className="p-1 cursor-pointer text-text-muted hover:bg-surface-hover border-b border-surface-border last:border-0"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}