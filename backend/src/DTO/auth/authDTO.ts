export interface CreateUserDTO{
    full_name:string,
    email:string,
    password:string
}

export interface UserRepsonseDTO{
    id:string,
    email:string
    name:string,
    role:string
}


export interface AuthResponseDTO {
    jwtToken:string,
    refreshToken:string
    user:{
        id:string,
        name:string,
        email:string,
        role:string
    }
}


export interface RefreshTokenDTO{
    newAccessToken:string
}


export interface RegisterUserDTO{
    full_name:string;
    email:string;
    password:string
}

export interface GoogleLoginResponseDTO{
    full_name:string,
    email:string,
    google_profile_id:string,
    profile_image_url:string
}