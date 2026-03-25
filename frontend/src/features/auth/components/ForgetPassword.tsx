import { useForm } from "react-hook-form"
import type { EmailPayload } from "../authInterfaces"
import { emailValidation } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForgetPassword } from "../hooks/useForgetPassword"

export default function ForgetPassword() {

    const { register, handleSubmit, formState: { errors} } = useForm<EmailPayload>({
        resolver: joiResolver(emailValidation, { abortEarly: false }),
        mode: "onBlur"
    })

    const {handleForgetPassword,error,isLoading} = useForgetPassword();

    const onSubmit = async (data: EmailPayload) => {
        await handleForgetPassword(data);
        console.log(data)
    }
    return (


        <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-semibold  text-soft-black mb-6 text-center font-Dynalight-Regular">designO</h2>

            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
                Enter your email to recive OTP
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

                {error && <p className="text-sm text-error">{error}</p>}




                {!isLoading ? (<button
                    type="submit"
                    className="auth-button">
                    Send email
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




        </div>


    )
}
