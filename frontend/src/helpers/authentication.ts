import { useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import type { RootState, AppDispatch } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logOut, setNewAccessToken } from "../app/authSlice";
import instance from "./axiosInstance";
import { API_ROUTES } from "../api/apiRoutes";
import type { IApiResponse } from "../api/responseType";
import type { RefreshTokenResponse } from "../api/apiInterface";

export const useAuthenticate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);


  const isAccessTokenValid = useCallback((): boolean => {
    if (!accessToken) return false;

    try {
      const decoded = jwtDecode(accessToken);
      const currentDate = new Date();
      if (decoded.exp && decoded.exp * 1000 < currentDate.getTime()) {
        return false;
      }
      return true;
    } catch {
     
      return false;
    }
  }, [accessToken]);

  const getNewAccessToken = useCallback(async () => {
    if (!refreshToken) {
      dispatch(logOut());
      return;
    }

    const result = await refreshTokenResult(refreshToken);

    if (!result?.data?.data) {
      dispatch(logOut());
      return;
    }
    dispatch(setNewAccessToken(result.data.data));
  }, [refreshToken, dispatch]);

  return { isAccessTokenValid, getNewAccessToken };
};

const refreshTokenResult = async (refreshToken: string) => {
  try {
    const result = await instance.post<IApiResponse<RefreshTokenResponse>>(
      API_ROUTES.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};