import { useEffect, useState } from "react";

interface ResendOtpSectionProps {
    onResend: () => Promise<void>;
    isLoading: boolean;
}

export default function ResendOtpSection({ onResend, isLoading }: ResendOtpSectionProps) {
    const [timer, setTimer] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);

    useEffect(() => {
        if (canResend) return;

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [canResend]);

    const handleResendClick = async () => {
        await onResend();
        setTimer(30);
        setCanResend(false);
    };

    return (
        <div className="mt-5 text-center text-sm text-gray-500">
            Didn't receive the code?{" "}
            {canResend ? (
                <button
                    onClick={handleResendClick}
                    type="button"
                    disabled={isLoading}
                    className="ml-1 text-soft-black font-Jost-Semibold hover:underline hover:cursor-pointer disabled:opacity-50"
                >
                    {isLoading ? "sending..." : "resend otp"}
                </button>
            ) : (
                <span className="ml-1 text-soft-black font-Jost-Semibold tabular-nums">
                    resend in {timer}
                </span>
            )}
        </div>
    );
}