import { useRecommendDesignsQuery } from "../commonEndpoints";
import DesignCard from "../components/cards/DesignCard";
import DesignCardSkeleton from "../skeltons/DesignCardSkeleton";

export default function Home() {

  const { data, isLoading, error } = useRecommendDesignsQuery()

  if (error) {
    return <div>error</div>
  }
  return (
    <div className="m-6">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
              <DesignCardSkeleton key={i} />
            ))
            : data?.data?.map((item) => (
              <DesignCard design={item} key={item.id} />
            ))
          }
        </div>
      </div>
    </div>
  )
}
