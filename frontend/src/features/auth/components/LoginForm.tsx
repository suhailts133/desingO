import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { LoginPayload } from "../authInterfaces"
import { loginValidations } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useLogin } from "../hooks/useLogin"
import { useGoogleLogin } from "@react-oauth/google"
import { useLoginGoogle } from "../hooks/useLoginGoogle"


export default function LoginFrom() {
    const [showPassword, setShowPassword] = useState(false)
    const changePasswordVisibility = () => setShowPassword(!showPassword)
    const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({
        resolver: joiResolver(loginValidations, { allowUnknown: false, abortEarly: false }),
        mode: "onBlur"
    })

    const { loginError, isLoading, handleLogin } = useLogin();
    const { googleError, isGoogle, handleGoogleLogin } = useLoginGoogle()


    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (code) => {
            await handleGoogleLogin(code)
        }
    })

    const onSubmit = async (data: LoginPayload) => {
        await handleLogin(data);
    }
    return (


        <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-semibold  text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>

            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
                Welcome Back
            </p>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>


                {/* email */}
                <div>
                    <label className="block text-sm  font-Jost-Semibold text-gray-700 mb-1">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="auth-input"
                        placeholder="example@gmail.com"
                    />
                    <p className="text-sm text-error">{errors.email?.message}</p>
                </div>

                {/* password */}
                <div>
                    <div className="flex items-center justify-between">
                        <label className="block text-sm  font-Jost-Semibold text-gray-700 mb-1">Password</label>
                        <span className="block text-sm  font-Jost-Regular text-gray-700 mb-1">
                            <Link
                                to="/auth/forgetpassword"
                                className="text-soft-black font-Jost-Semibold 
                                hover:underline"> Forget Password ?</Link>
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            className="auth-input"
                            placeholder={showPassword ? "password" : "********"}
                        />
                        <button type="button" className="absolute right-3 inset-y-0 flex items-center text-gray-500" onClick={changePasswordVisibility}>
                            {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
                        </button>
                    </div>
                    <p className="text-sm text-error">{errors.password?.message}</p>
                </div>

                {loginError && <p className="text-sm text-error">{loginError}</p>}
                {googleError && <p className="text-sm text-error">{googleError}</p>}




                {!isLoading ? (<button
                    type="submit"
                    className="auth-button">
                    Login
                </button>) : (
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="auth-disabled-button">

                        <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>

                        Verifying
                    </button>
                )}
            </form>


            {/* divider */}
            <div className="flex items-center justify-center md:justify-between mt-5">
                <div className="block h-px w-4/12 bg-soft-black/50"></div>
                <p className="mx-2 text-sm font-light text-gray-500">
                    OR
                </p>
                <div className="block h-px w-4/12 bg-soft-black/50"></div>
            </div>

            {/* google signup button */}

            <div className="mt-5 sm:px-0 max-w-sm">
                {!isGoogle ? (<button type="button" 
                className="google-button"
                 onClick={() => login()}>
                    <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    Login with Google
                </button>) : (<button
                    type="submit"
                    disabled={isLoading}
                    className="auth-disabled-button">

                    <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>

                    Verifying
                </button>)}

            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?
                {/* <a href="#" className="text-soft-black font-Jost-Semibold hover:underline">Sign up</a> */}
                <Link
                    to="/auth/signup"
                    className="text-soft-black font-Jost-Semibold 
        hover:underline"> signup</Link>
            </div>
        </div>


    )
}
