import { useState } from "react";

import { useGetMySavedDesignsQuery } from "../wishlistEndpoints";
import DesignCardSkeleton from "../../common/skeltons/DesignCardSkeleton";
import Pagination from "../../../shared/common/Pagination";
import DesignCard from "../../common/components/cards/DesignCard";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function SaveDesignPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetMySavedDesignsQuery({
    page
  });
  const navigate = useNavigate()



  const savedDesigns = data?.data
  if (isLoading) return <p>Loading...</p>
  if (error || !savedDesigns) return <div className="p-10 text-center text-red-500">Error loading designs.</div>;

  return (
    <div className="w-full flex flex-col gap-6">
      <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-sm text-soft-black hover:underline">
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <DesignCardSkeleton key={i} />
            ))
            : savedDesigns.map(item => (
              <DesignCard design={item} key={item.id} />
            ))
          }
        </div>
      </div>

      <Pagination
        page={page}
        totalItem={data?.total ?? 0}
        whichItem="designs"
        totalPages={data?.totalPages ?? 1}
        onDecrease={() => setPage(p => p - 1)}
        onIncrease={() => setPage(p => p + 1)}
      />
    </div>
  );
}