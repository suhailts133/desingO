import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useResendOtp } from "../hooks/useResendOtp";
import { useForgetPasswordOtpVerification } from "../hooks/useForgetPasswordOtpVerification";
import { useForgetPasswordResendOtp } from "../hooks/useForgetPasswordResendOtp";
import { useHandleResponse } from "../../../helpers/useHandleResponse";
import ResendOtpSection from "./ResendOtpSection";



export default function OtpForm() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [error1, setError] = useState<string>("");
    const handleResponse = useHandleResponse()
    const location = useLocation();
    const email = location.state?.email;
    const where = location.state?.where;

    
    const { handleVerification, error, isLoading } = useVerifyOtp();
    const { handleResendOtp, resendOTPError, resendOtpSuccessMessage, isResendOtpLoading } = useResendOtp();
    const { handleForgetpasswordOtpVerification, forgetPasswordError, isLoadingForgetPassword } = useForgetPasswordOtpVerification();
    const { handleForgetpasswordResendOtp, forgetPasswordResendError, forgetPasswordResendOtpSuccessMessage, isLoadingForgetPasswordResend } = useForgetPasswordResendOtp();

    const isSubmitLoading = isLoading || isLoadingForgetPassword;
    const isResendLoading = isResendOtpLoading || isLoadingForgetPasswordResend;

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        if (error) {
            setError("");
        }
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handdleSubmit = async () => {
        if (otp.some((d) => d === "")) {
            setError("Please enter all 6 digits.");
            return;
        }
        if (where === "signup") {
            const result = await handleVerification({ email, otp: otp.join("") });
            handleResponse(result.success, "OTP Verification Successfull", result.message, "/", { state: { where: "signUpOtpVerification" } })
        } else {
            await handleForgetpasswordOtpVerification({ email, otp: otp.join("") });
        }
    };

    const handleResend = async () => {
        if (isResendLoading) return;
        if (where === "signup") {
            await handleResendOtp({ email });
        } else {
            await handleForgetpasswordResendOtp({ email });
        }
    };




    return (
        <div className="w-fit bg-surface backdrop-blur-2xl border border-surface-border rounded-xl p-8">
            <h2 className="text-4xl font-semibold text-accent mb-3 text-center font-Dynalight-Regular">
                designO
            </h2>

            <p className="text-center text-sm text-text-muted mb-6">
                Enter the 6-digit code sent to your email
            </p>

            {/* OTP inputs */}
            <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="
                            w-12 h-14 text-center text-xl font-semibold text-text-primary
                            border border-surface-border rounded-lg bg-surface-hover
                            focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
                            hover:border-accent-hover
                            transition-all duration-300"
                    />
                ))}
            </div>

            {/* Error / success messages */}
            {error1 && <p className="text-center text-sm text-error mb-4 -mt-2">{error1}</p>}
            {resendOTPError && <p className="text-center text-sm text-error mb-4 -mt-2">{resendOTPError}</p>}
            {resendOtpSuccessMessage && <p className="text-center text-sm text-success mb-4 -mt-2">{resendOtpSuccessMessage}</p>}
            {forgetPasswordError && <p className="text-center text-sm text-error mb-4 -mt-2">{forgetPasswordError}</p>}
            {forgetPasswordResendError && <p className="text-center text-sm text-error mb-4 -mt-2">{forgetPasswordResendError}</p>}
            {forgetPasswordResendOtpSuccessMessage && <p className="text-center text-sm text-success mb-4 -mt-2">{forgetPasswordResendOtpSuccessMessage}</p>}

            {/* Submit button */}
            <div className="flex justify-center">
                {!isSubmitLoading ? (
                    <button type="submit" className="auth-button" onClick={handdleSubmit}>
                        Verify OTP
                    </button>
                ) : (
                    <button type="submit" disabled className="auth-disabled-button flex items-center justify-center gap-2">
                        <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifying otp
                    </button>
                )}
            </div>

            <ResendOtpSection onResend={handleResend} isLoading={isResendLoading} />
        </div>
    );
}