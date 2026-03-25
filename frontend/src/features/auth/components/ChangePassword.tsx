import { Eye, EyeOff } from "lucide-react"
import { joiResolver } from "@hookform/resolvers/joi"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { IPassword } from "../authInterfaces"
import { changePasswordValidations } from "../../../validations/authValidations"
import { useChangePassword } from "../hooks/useChangePassword"
import { useLocation } from "react-router-dom"


export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordVisibility = () => setShowPassword(!showPassword)
  const confirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)
  const { register, handleSubmit, formState: { errors } } = useForm<IPassword>({
    resolver: joiResolver(changePasswordValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const location = useLocation();
  const email = location.state?.email
  const { handleChangePassword, error, isLoading } = useChangePassword()

  const onSubmit = async (data: IPassword) => {
    await handleChangePassword({password:data.password,email})
  }



  return (


    <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
      <h2 className="text-4xl font-semibold  text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>

      <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
        Change password
      </p>

      <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>

     

        {/* password */}
        <div>
          <label className="block text-sm  font-Jost-Semibold text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder={showPassword ? "password" : "********"}
            />
            <button type="button" className="absolute right-3 inset-y-0 flex items-center text-gray-500" onClick={passwordVisibility}>
              {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
            </button>
          </div>
          <p className="text-sm text-error">{errors.password?.message}</p>
        </div>

        {/* confirm password */}
        <div>
          <label className="block text-sm  font-Jost-Semibold text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="auth-input"
              placeholder={showConfirmPassword ? "password" : "********"}
            />
            <button type="button" className="absolute right-3 inset-y-0 flex items-center text-gray-500" onClick={confirmPasswordVisibility}>
              {showConfirmPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} />}
            </button>
          </div>
          <p className="text-sm text-error">{errors.confirmPassword?.message}</p>
        </div>


        {!isLoading ? (<button
          type="submit"
          className="auth-button">
          Sign Up
        </button>) : (
          <button
            type="submit"
            disabled={isLoading}
            className="auth-disabled-button">

            <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>

            Sending otp
          </button>
        )}

      </form>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
