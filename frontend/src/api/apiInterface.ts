export interface JwtResponse {
  jwtToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface JwtAccessTokenPayload {
  id: string;
  name: string;
  email: string;
  role: "Designer" | "Admin" | "Customer";
}

export interface RefreshTokenResponse {
  newAccessToken: string
}