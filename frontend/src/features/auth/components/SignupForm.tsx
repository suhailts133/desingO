import { joiResolver } from "@hookform/resolvers/joi"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { ISignup } from "../authInterfaces"
import { signupValidations } from "../../../validations/authValidations"
import { useSignUp } from "../hooks/useSignUp"
import { useLoginGoogle } from "../hooks/useLoginGoogle"
import { useGoogleLogin } from "@react-oauth/google"
import SubmitButton from "../../../shared/common/SubmitButton"
import GoogleLoginButton from "../../../shared/form/GoogleLoginButton"
import { InputField } from "../../../shared/form/InputField"
import { useHandleResponse } from "../../../helpers/useHandleResponse"


export default function SignupForm() {

  const { register, handleSubmit, formState: { errors } } = useForm<ISignup>({
    resolver: joiResolver(signupValidations, { abortEarly: false, allowUnknown: false }),
    mode: "onBlur"
  })
  const { handleSignUp, isLoading } = useSignUp()
  const { isGoogle, handleGoogleLogin } = useLoginGoogle()
  const handleResponse = useHandleResponse()
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (code) => {
      const result = await handleGoogleLogin(code)
      handleResponse(result.success, "Please Confirm the OTP",result.message, "/auth/verify-otp")

    }
  })

  const onSubmit = async (data: ISignup) => {
    const result = await handleSignUp({
      full_name: data.full_name,
      email: data.email,
      password: data.password
    })
    handleResponse(result.success, "Please Verify Your OTP", result.message, "/auth/verify-otp",{ state:{where:"signup", email:data.email}})
  }



  return (


    <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
      <h2 className="text-4xl font-semibold text-soft-black mb-2 text-center font-Dynalight-Regular tracking-tight">
        designO
      </h2>
      <p className="text-center text-base font-Jost-Semibold text-gray-500 mb-8 tracking-wide">
        Create Account
      </p>

      <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>

        <InputField label="Fullname" type="text" placeholder="John doe" registration={register("full_name")} error={errors.full_name?.message} />
        <InputField label="Email" type="email" placeholder="you@studio.com" registration={register("email")} error={errors.email?.message} />
        <InputField showPasswordToggle={true} placeholder="Your password" label="Password" type="password" registration={register("password")} error={errors.password?.message} />
        <InputField showPasswordToggle={true} placeholder="Your password" label="Password" type="password" registration={register("confirmPassword")} error={errors.confirmPassword?.message} />

        <SubmitButton isLoading={isLoading} label="Sign Up" loadingLabel="Sending OTP" type="submit" />

      </form>
      {/* divider */}
      <div className="flex items-center justify-center md:justify-between mt-5">
        <div className="block h-px w-4/12 bg-soft-black/50"></div>
        <p className="mx-2 text-sm font-light text-gray-400">
          OR
        </p>
        <div className="block h-px w-4/12 bg-soft-black/50"></div>
      </div>

      <div className="mt-5 sm:px-0 max-w-sm">
        <GoogleLoginButton
          isLoading={isGoogle}
          onClick={() => login()}
          label="Login with Google"
          loadingLabel="Verifying"
        />
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
