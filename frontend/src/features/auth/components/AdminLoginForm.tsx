import { useForm } from "react-hook-form"
import type { LoginPayload } from "../authInterfaces"
import { loginValidations } from "../../../validations/authValidations"
import { joiResolver } from "@hookform/resolvers/joi"
import { useAdminLogin } from "../hooks/useAdminLogin"
import { InputField } from "../../../shared/form/InputField"
import SubmitButton from "../../../shared/common/SubmitButton"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


export default function AdminLoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({
        resolver: joiResolver(loginValidations, { allowUnknown: false, abortEarly: false }),
        mode: "onBlur"
    })
    const navigate = useNavigate()
    const { isLoading, handleAdminLogin } = useAdminLogin();

    const onSubmit = async (data: LoginPayload) => {
        const result = await handleAdminLogin(data);
        if(result.success){
            toast.success("login success")
            navigate("/admin/dashboard")
        }else{
            toast.error(result.message ?? "Something went wrong")
        }
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
                    <InputField placeholder="example.email.com" label="Email" type="email" registration={register("email")} error={errors.email?.message} />
                </div>
                {/* password */}
                <div>
                    <InputField showPasswordToggle={true} placeholder="your password" label="Password" type="password" registration={register("password")} error={errors.password?.message} />
                </div>

                
                <SubmitButton isLoading={isLoading} label="Login" loadingLabel="Verifying" type="submit" />
            </form>






        </div>

    )
}
