
export interface ISignup {
    full_name:string
    email:string
    password:string
    confirmPassword:string
}

export interface IPassword{
  password:string,
  confirmPassword:string,
}


export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface SignUpPayload {
  full_name: string;
  email: string;
  password: string;
}


export interface VerifyOTPPayload{
  email:string,
  otp:string,
}

export interface ResendOtpPayload{
  email:string
}
export interface EmailPayload{
  email:string
}

export interface LoginPayload{
  email:string,
  password:string
}


export interface changePasswordPayload{
  email:string,
  password:string,
}

export interface GoogleLoginPayload{
  code:string
}


export interface RefreshTokenResponse{
  newAccessToken:string
}