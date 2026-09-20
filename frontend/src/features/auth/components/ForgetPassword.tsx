import { useForm } from "react-hook-form"
import type { EmailPayload } from "../authInterfaces"
import { emailValidation } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForgetPassword } from "../hooks/useForgetPassword"
import { InputField } from "../../../shared/form/InputField"
import SubmitButton from "../../../shared/common/SubmitButton"

export default function ForgetPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<EmailPayload>({
        resolver: joiResolver(emailValidation, { abortEarly: false }),
        mode: "onBlur"
    })
    const { handleForgetPassword, error, isLoading } = useForgetPassword();
    const onSubmit = async (data: EmailPayload) => await handleForgetPassword(data);


    return (
        <div className="max-w-md w-full bg-surface backdrop-blur-2xl border border-surface-border rounded-xl p-8">
            <h2 className="text-4xl font-semibold  text-accent mb-6 text-center font-Dynalight-Regular">designO</h2>
            <p className="text-center text-lg font-Jost-Semibold text-gray-500 mb-6">
                Enter your email to recive OTP
            </p>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* email */}
                <InputField label="Email" type="email" placeholder="you@studio.com" registration={register("email")} error={errors.email?.message} />
                {error && <p className="text-sm text-error">{error}</p>}
                <SubmitButton isLoading={isLoading} label="Send Email" loadingLabel="Verifying" type="submit" />
            </form>
        </div>
    )
}
