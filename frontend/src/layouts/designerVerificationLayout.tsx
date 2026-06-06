import { Outlet } from "react-router-dom";
export default function DesignerVerificationLayout() {

    return (
      <div className="min-h-screen bg-linear-to-br from-blush-pale/80 via-blush-light/80 to-peach/80 flex items-center justify-center p-4">
        <Outlet />
      </div>
    )

}
