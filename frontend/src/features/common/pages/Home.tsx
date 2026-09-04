import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken";
import { useRecommendDesignsQuery, useRecommendJobsQuery } from "../commonEndpoints";
import DesignCard from "../components/cards/DesignCard";
import DesignCardSkeleton from "../skeltons/DesignCardSkeleton";
import JobCard from "../components/cards/JobCard";

export default function Home() {
  const { role } = useDecodeAccessToken();

  const isCustomer = role === "Customer";
  const isDesigner = role === "Designer";


  const { data: designData, isLoading: isDesignLoading, error: designError, } = useRecommendDesignsQuery(undefined, { skip: !isCustomer });

  const { data: jobData, isLoading: isJobLoading, error: jobError, } = useRecommendJobsQuery(undefined, { skip: !isDesigner });


  const data = isCustomer ? designData : isDesigner ? jobData : null;
  const isLoading = isCustomer ? isDesignLoading : isDesigner ? isJobLoading : false;
  const error = isCustomer ? designError : isDesigner ? jobError : null;

  if (error) {
    return <div>Error loading data...</div>;
  }


  if (!isCustomer && !isDesigner) {
    return (
      <div className="m-6 max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
        Welcome to the platform.
      </div>
    );
  }


  const dataType = data?.DataType; 
  const recommendType = data?.type; 

  let title = "";
  if (recommendType === "RECOMENDED") {
    title = dataType === "JOB" ? "These are your recommended jobs" : "These are your recommended designs";
  } else if (recommendType === "RECENT") {
    title = dataType === "JOB" ? "These are the recent jobs" : "These are the recent designs";
  }

  return (
    <div className="m-6">
      <div className="max-w-7xl mx-auto px-6 py-8">

    
        {title && (
          <h2 className="text-2xl font-Jost-Semibold mb-6 text-soft-black">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <DesignCardSkeleton key={i} />
            ))
          ) : (
           
            <>
              {isCustomer && designData?.data?.map((item) => (
                <DesignCard design={item} key={item.id} />
              ))}

              {isDesigner && jobData?.data?.map((item) => (
                <JobCard job={item} key={item.id} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}