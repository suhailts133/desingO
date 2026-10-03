import { Navigate, useNavigate } from "react-router-dom";
import { useDecodeAccessToken } from "../../../helpers/decodeAccessToken";
import HomeHero from "../components/homeComponents/HomeHero";
import HowItWorks from "../components/homeComponents/HowItWorks";
import FeatureStrip from "../components/homeComponents/FeatureStrip";
export default function Home() {
  const { role } = useDecodeAccessToken();
  const navigate = useNavigate();

  const isCustomer = role === "Customer";
  const isDesigner = role === "Designer";
  const isAdmin = role === "Admin";

  const goOrLogin = (path: string) => navigate(role ? path : "/auth/login", { state: { from: path } });

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (isDesigner) {
    return <Navigate to="/designer/dashboard" replace />;
  }
  if (isCustomer) {
    return <Navigate to="/customer/dashboard" replace />;
  }

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
