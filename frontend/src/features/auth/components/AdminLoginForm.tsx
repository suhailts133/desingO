import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { LoginPayload } from "../authInterfaces"
import { loginValidations } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useAdminLogin } from "../hooks/useAdminLogin"


export default function AdminLoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const changePasswordVisibility = () => setShowPassword(!showPassword)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginPayload>({
        resolver: joiResolver(loginValidations, { allowUnknown: false, abortEarly: false }),
        mode: "onBlur"
    })

    const { loginError, isLoading, handleAdminLogin } = useAdminLogin();

    const onSubmit = async (data: LoginPayload) => {
        await handleAdminLogin(data);
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




                {!isLoading ? (<button
                    type="submit"
                    className="auth-button">
                    Login
                </button>) : (
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="auth-disabled-button">

                        <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>

                        Verifying
                    </button>
                )}
            </form>



         


        </div>

    )
}
