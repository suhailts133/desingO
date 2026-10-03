import { Outlet } from "react-router-dom";
import MeshBackdrop from "../shared/common/MeshBackDrop";
export default function DesignerVerificationLayout() {

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <MeshBackdrop />
      <Outlet />
    </div>
  )

}
