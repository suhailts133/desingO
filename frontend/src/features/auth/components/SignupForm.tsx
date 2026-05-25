import { Eye, EyeOff } from "lucide-react"
import { joiResolver } from "@hookform/resolvers/joi"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { ISignup } from "../authInterfaces"
import { signupValidations } from "../../../validations/authValidations"
import { useSignUp } from "../hooks/useSignUp"
import { useLoginGoogle } from "../hooks/useLoginGoogle"
import { useGoogleLogin } from "@react-oauth/google"
import SubmitButton from "../../../shared/common/SubmitButton"


export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordVisibility = () => setShowPassword(!showPassword)
  const confirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)
  const { register, handleSubmit, formState: { errors } } = useForm<ISignup>({
    resolver: joiResolver(signupValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const { handleSignUp, error, isLoading } = useSignUp()
  const { googleError, isGoogle, handleGoogleLogin } = useLoginGoogle()


  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (code) => {
      await handleGoogleLogin(code)
    }
  })

  const onSubmit = async (data: ISignup) => {
    await handleSignUp({
      full_name: data.full_name,
      email: data.email,
      password: data.password
    })
  }



  return (


    <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
      <h2 className="text-4xl font-semibold  text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>

      <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
        Create Account
      </p>

      <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>

        {/* name */}
        <div>
          <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">Full Name</label>
          <input
            {...register("full_name")}
            type="text"
            className="auth-input"
            placeholder="Jhon Doe"
          />
          <p className="text-sm text-error">{errors.full_name?.message}</p>
        </div>

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


        <SubmitButton isLoading={isLoading} label="Sign Up" loadingLabel="Sending OTP"  type="submit"/>

      </form>

      {error && <p className="text-sm text-error">{error}</p>}
      {googleError && <p className="text-sm text-error">{googleError}</p>}

      {/* divider */}
      <div className="flex items-center justify-center md:justify-between mt-5">
        <div className="block h-px w-4/12 bg-soft-black/50"></div>
        <p className="mx-2 text-sm font-light text-gray-400">
          OR
        </p>
        <div className="block h-px w-4/12 bg-soft-black/50"></div>
      </div>

      {/* google signup button */}

      <div className="mt-5 sm:px-0 max-w-sm">
        {!isGoogle ?
          (<button type="button"
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
        Already have an account?
        <Link
          to="/auth/login"
          className="text-soft-black font-Jost-Semibold 
        hover:underline">login</Link>
      </div>
    </div>
  )
}
