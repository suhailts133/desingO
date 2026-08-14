import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { LoginPayload } from "../authInterfaces";
import { loginValidations } from "../../../validations/authValidations";
import { joiResolver } from "@hookform/resolvers/joi";
import { useLogin } from "../hooks/useLogin";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginGoogle } from "../hooks/useLoginGoogle";
import SubmitButton from "../../../shared/common/SubmitButton";
import { InputField } from "../../../shared/form/InputField";
import { useHandleResponse } from "../../../helpers/useHandleResponse";
import GoogleLoginButton from "../../../shared/form/GoogleLoginButton";

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>({ resolver: joiResolver(loginValidations), mode: "onBlur", });
    const handleResponse = useHandleResponse()
    const { isLoading, handleLogin } = useLogin();
    const { isGoogle, handleGoogleLogin } = useLoginGoogle();

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (code) => {
            const result = await handleGoogleLogin(code);
            handleResponse(result.success, "Login Success", result.message, "/")
        },
    });

    const onSubmit = async (data: LoginPayload) => {
        const result = await handleLogin(data);
        handleResponse(result.success, "Login Success", result.message, "/")

    };

    return (
        <div className="max-w-md w-full bg-white/50 backdrop-blur-2xl shadow-blush/30 rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-semibold text-soft-black mb-2 text-center font-Dynalight-Regular tracking-tight">
                designO
            </h2>
            <p className="text-center text-base font-Jost-Semibold text-gray-500 mb-8 tracking-wide">
                Welcome back
            </p>


            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <InputField label="Email" type="email" placeholder="you@studio.com" registration={register("email")} error={errors.email?.message} />
                {/* Password  */}
                <InputField label="Password" placeholder="********" showPasswordToggle={true} registration={register("password")} error={errors.password?.message}
                    labelAction={<Link to="/auth/forgetpassword" className="text-sm font-Jost-Regular text-soft-black hover:underline">Forgot Password?</Link>}
                />
                <SubmitButton isLoading={isLoading} label="Login" loadingLabel="Verifying" type="submit" />
            </form>

            <div className="flex items-center justify-center md:justify-between mt-5">
                <div className="block h-px w-4/12 bg-soft-black/50"></div>
                <p className="mx-2 text-sm font-light text-gray-500">OR</p>
                <div className="block h-px w-4/12 bg-soft-black/50"></div>
            </div>

            {/* Google Login */}
            <div className="mt-5 sm:px-0 max-w-sm">
                <GoogleLoginButton
                    isLoading={isGoogle}
                    onClick={() => login()}
                    label="Login with Google"
                    loadingLabel="Verifying"
                />
            </div>


            <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                    to="/auth/signup"
                    className="text-soft-black font-Jost-Semibold hover:underline"
                >
                    signup
                </Link>
            </div>
        </div>
    );
}