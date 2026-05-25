import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { useResendOtp } from "../hooks/useResendOtp";
import { useForgetPasswordOtpVerification } from "../hooks/useForgetPasswordOtpVerification";
import { useForgetPasswordResendOtp } from "../hooks/useForgetPasswordResendOtp";



export default function OtpForm() {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const [error1, setError] = useState<string>("");
    const location = useLocation();
    const email = location.state?.email;
    const where = location.state?.where;


    const [timer, setTimer] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);
    const [timerActive, setTimerActive] = useState<boolean>(true);

    const { handleVerification, error, isLoading } = useVerifyOtp();
    const { handleResendOtp, resendOTPError, resendOtpSuccessMessage, isResendOtpLoading } = useResendOtp();
    const { handleForgetpasswordOtpVerification, forgetPasswordError, isLoadingForgetPassword } = useForgetPasswordOtpVerification();
    const { handleForgetpasswordResendOtp, forgetPasswordResendError, forgetPasswordResendOtpSuccessMessage, isLoadingForgetPasswordResend } = useForgetPasswordResendOtp();

    const isSubmitLoading = isLoading || isLoadingForgetPassword;
    const isResendLoading = isResendOtpLoading || isLoadingForgetPasswordResend;

  
    const startTimer = () => {
        setTimer(30);
        setCanResend(false);
        setTimerActive(true);
    };

    
    useEffect(() => {
        if (!timerActive) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive]);

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
            await handleVerification({ email, otp: otp.join("") });
        } else {
            await handleForgetpasswordOtpVerification({ email, otp: otp.join("") });
        }
    };

    const handleResend = async () => {
        if (!canResend || isResendLoading) return;
        if (where === "signup") {
            await handleResendOtp({ email });
        } else {
            await handleForgetpasswordResendOtp({ email });
        }
      
        startTimer();
    };

  
    // const formatTime = (seconds: number) => {
    //     const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    //     const s = (seconds % 60).toString().padStart(2, "0");
    //     return `${m}:${s}`;
    // };

    return (
        <div className="w-fit bg-white/50 backdrop-blur-2xl shadow-blush/40 rounded-xl shadow-2xl p-8">
            <h2 className="text-4xl font-semibold text-soft-black mb-3 text-center font-Dynalight-Regular">
                designO
            </h2>

            <p className="text-center text-sm text-gray-500 mb-6">
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
                            w-12 h-14 text-center text-xl font-semibold
                            border border-gray-400 rounded-lg shadow-md
                            focus:outline-none focus:border-blush-deep focus:ring focus:ring-blush-deep
                            hover:border-blush hover:ring hover:ring-blush hover:outline-none
                            transition-all duration-300 bg-transparent"
                    />
                ))}
            </div>

            {/* Error / success messages */}
            {error1 && <p className="text-center text-sm text-error mb-4 -mt-2">{error1}</p>}
            {error && <p className="text-center text-sm text-error mb-4 -mt-2">{error}</p>}
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

   
            <div className="mt-5 text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                {canResend ? (
                    <button
                        onClick={handleResend}
                        type="button"
                        disabled={isResendLoading}
                        className="ml-1 text-soft-black font-Jost-Semibold hover:underline hover:cursor-pointer disabled:opacity-50"
                    >
                        {isResendLoading ? "sending..." : "resend otp"}
                    </button>
                ) : (
                    <span className="ml-1 text-soft-black font-Jost-Semibold tabular-nums">
                        resend in {timer}
                    </span>
                )}
            </div>
        </div>
    );
}