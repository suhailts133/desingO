import { Outlet, Navigate } from "react-router-dom";
import { useAuthenticate } from "../helpers/authentication";
import { useEffect } from "react";

export default function AuthLayout() {
  const {isAccessTokenValid,getNewAccessToken} = useAuthenticate()
  useEffect(() => {
    if(!isAccessTokenValid()){
      getNewAccessToken()
    }
  },[isAccessTokenValid,getNewAccessToken])


  if (isAccessTokenValid()) {
    return <Navigate to="/" />
  } else {
    return (
      <div className="min-h-screen bg-linear-to-br from-blush-pale/80 via-blush-light/80 to-peach/80 flex items-center justify-center p-4">
        <Outlet />
      </div>
    )
  }


}
