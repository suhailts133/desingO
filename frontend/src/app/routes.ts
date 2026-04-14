import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignupForm from "../features/auth/components/SignupForm";
import LoginFrom from "../features/auth/components/LoginForm";
import OtpForm from "../features/auth/components/OtpForm";
import MainLayout from "../layouts/MainLayout";
import Home from "../features/base/pages/Home";
import ForgetPassword from "../features/auth/components/ForgetPassword";
import ChangePassword from "../features/auth/components/ChangePassword";
import AdminLayout from "../layouts/AdminLayout";
import UsersTable from "../features/admin/users/components/UsersTable";
import Dashboard from "../features/admin/dashboard/Dashboard";
import AdminLoginForm from "../features/auth/components/AdminLoginForm";
import UserDetail from "../features/admin/users/components/UserDetail";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import DesignerVerificationLayout from "../layouts/designerVerificationLayout";
import DesignerVerificationForm from "../features/designer/designerVerification/components/DesignerVerificationForm";
import DesignerVerificationTable from "../features/admin/designerVerification/components/DesignerVerificationTable";
import DesignerVerificationDetails from "../features/admin/designerVerification/components/DesignerVerificationDetails";
import DesignerLayout from "../layouts/DesignerLayout";
import DesignerDashboard from "../features/designer/dashboard/component/DesignerDashboard";
import Designs from "../features/designer/designs/pages/Designs";
import DesignForm from "../features/designer/designs/components/DesignForm";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "../features/user/dashboard/CustomerDashboard";
import Jobs from "../features/user/jobs/page/Jobs";
import JobRequestForm from "../features/user/jobs/components/JobRequestForm";
import JobRequestDetail from "../features/user/jobs/components/JobRequestDetail";
import DesignDetail from "../features/designer/designs/components/DesignDetail";
import BrowseDesigns from "../features/base/pages/BrowseDesigns";
import BrowseJobs from "../features/base/pages/BrowseJobs";
import JobApplications from "../features/user/jobApplications/pages/JobApplications";
import MyJobApplications from "../features/designer/myJobApplications/pages/MyJobApplication";
import DesignerProfilePage from "../features/designer/profile/pages/DesignerProfilePage";


const router = createBrowserRouter([
    {
        path: "/",
        Component: MainLayout,
        children: [
            { index: true, Component: Home },
            { path: "jobs", Component: BrowseJobs },
            { path: "jobs/:id", Component: JobRequestDetail },
            { path: "designs/:id", Component: DesignDetail },
            { path: "designs", Component: BrowseDesigns }
        ]
    },
    {
        path: "auth",
        Component: AuthLayout,
        children: [
            { path: "signup", Component: SignupForm },
            { path: "login", Component: LoginFrom },
            { path: "verify-otp", Component: OtpForm },
            { path: "forgetpassword", Component: ForgetPassword },
            { path: "change-password", Component: ChangePassword },
        ]
    },
    {
        path: "auth",
        Component: AdminAuthLayout,
        children: [
            { path: "admin-login", Component: AdminLoginForm }

        ]
    },
    {
        path: "designer",
        Component: DesignerVerificationLayout,
        children: [
            { path: "designer-verification", Component: DesignerVerificationForm }
        ]
    },
    {
        path: "admin",
        Component: AdminLayout,
        children: [
            { path: "dashboard", Component: Dashboard },
            { path: "users", Component: UsersTable },
            { path: "users/:id", Component: UserDetail },
            { path: "designer-requests", Component: DesignerVerificationTable },
            { path: "designer-requests/:id", Component: DesignerVerificationDetails }

        ]
    },
    {
        path: "designer",
        Component: DesignerLayout,
        children: [
            { path: "dashboard", Component: DesignerDashboard },
            { path: "designs", Component: Designs },
            { path: "add-design", Component: DesignForm },
            { path: "job-applications/my", Component: MyJobApplications }

        ]
    },
    {
        path: "customer",
        Component: CustomerLayout,
        children: [
            { path: "dashboard", Component: CustomerDashboard },
            { path: "jobs", Component: Jobs },
            { path: "add-job", Component: JobRequestForm },
            { path: "job-applications", Component: JobApplications }
        ]
    },
    {
        path: "profile",
        Component: DesignerLayout,
        children: [
            { path: "designer", Component: DesignerProfilePage }
        ]
    }

])

export default router