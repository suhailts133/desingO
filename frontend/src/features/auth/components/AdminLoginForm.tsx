import { useForm } from "react-hook-form"
import type { LoginPayload } from "../authInterfaces"
import { loginValidations } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useAdminLogin } from "../hooks/useAdminLogin"
import { InputField } from "../../../shared/form/InputField"
import SubmitButton from "../../../shared/common/SubmitButton"
import { useHandleResponse } from "../../../helpers/useHandleResponse"

export default function AdminLoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({
        resolver: joiResolver(loginValidations, { allowUnknown: false, abortEarly: false }),
        mode: "onBlur"
    })
    const handleResponse = useHandleResponse()
    const { isLoading, handleAdminLogin } = useAdminLogin();

    const onSubmit = async (data: LoginPayload) => {
        const result = await handleAdminLogin(data);
        handleResponse(result.success, "login success", result.message, "/admin/dashboard")
    }

    return (
        <div className="max-w-md w-full bg-white/40 backdrop-blur-2xl  shadow-blush/30 rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-semibold text-soft-black mb-2 text-center font-Dynalight-Regular tracking-tight">
                designO
            </h2>
            <p className="text-center text-base font-Jost-Semibold text-gray-500 mb-8 tracking-wide">
                Welcome back
            </p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <InputField placeholder="you@studio.com" label="Email" type="email" registration={register("email")} error={errors.email?.message} />
                <InputField showPasswordToggle={true} placeholder="Your password" label="Password" type="password" registration={register("password")} error={errors.password?.message} />
                <SubmitButton isLoading={isLoading} label="Sign In" loadingLabel="Verifying" type="submit" />
            </form>
        </div>
    )
}