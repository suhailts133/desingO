import { Navigate, useNavigate } from "react-router-dom";
import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken";
import { useRecommendDesignsQuery } from "../commonEndpoints";
import DesignCard from "../components/cards/DesignCard";
import DesignCardSkeleton from "../skeltons/DesignCardSkeleton";
import HomeHero from "../components/homeComponents/HomeHero";
import HowItWorks from "../components/homeComponents/HowItWorks";
import FeatureStrip from "../components/homeComponents/FeatureStrip";
import AIDesignButton from "../../aiDesign/components/AIDesignButton";
import AIDesignChatPanel from "../../aiDesign/components/AIDesignChatPanel";

export default function Home() {
  const { role } = useDecodeAccessToken();
  const navigate = useNavigate();

  const isCustomer = role === "Customer";
  const isDesigner = role === "Designer";
  const isAdmin = role === "Admin";

  const {
    data: designData,
    isLoading: isDesignLoading,
    error: designError,
  } = useRecommendDesignsQuery(undefined, { skip: !isCustomer });

  const goOrLogin = (path: string) => navigate(role ? path : "/auth/login", { state: { from: path } });

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (isDesigner) {
    return <Navigate to="/designer/dashboard" replace />;
  }
  if (designError) {
    return <div>Error loading data...</div>;
  }
  if (!isCustomer) {
    return (
      <>
        <HomeHero
          onBrowseJobs={() => navigate("/jobs")}
          onPostJob={() => goOrLogin("/customer/add-job")}
          onBrowseDesigners={() => navigate("/designers")}
          onBecomeDesigner={() => goOrLogin("/designer/designer-verification")}
          onTryAI={() => navigate("/auth/login", { state: { from: "/", openAI: true } })}
        />
        <HowItWorks />
        <FeatureStrip />
      </>
    );
  }

  const recommendType = designData?.type;
  const title = recommendType === "RECOMENDED" ? "These are your recommended designs" : "These are the recent designs";

  return (
    <>
      <div className="m-6">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {title && <h2 className="text-2xl font-Jost-Semibold mb-6 text-text-primary">{title}</h2>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isDesignLoading
              ? Array.from({ length: 8 }).map((_, i) => <DesignCardSkeleton key={i} />)
              : designData?.data?.map((item) => <DesignCard design={item} key={item.id} />)}
          </div>
        </div>
      </div>
      <AIDesignButton />
      <AIDesignChatPanel />
    </>
  );
}
