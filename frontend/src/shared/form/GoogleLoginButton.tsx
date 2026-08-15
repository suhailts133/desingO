interface GoogleLoginButtonProps {
    isLoading?: boolean;
    onClick: () => void;
    label?: string;
    loadingLabel?: string;
    className?: string;
}

export default function GoogleLoginButton({
    isLoading = false,
    onClick,
    label = "Login with Google",
    loadingLabel = "Verifying...",
    className = "",
}: GoogleLoginButtonProps) {
    if (isLoading) {
        return (
            <button
                type="button"
                disabled
                className={`auth-disabled-button flex items-center justify-center gap-2 ${className}`}
            >
                <svg className="mr-2 size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
                {loadingLabel}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`auth-button flex items-center justify-center cursor-pointer ${className}`}
        >
            <svg
                className="mr-2 -ml-1 w-4 h-4"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 488 512"
            >
                <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                />
            </svg>
            {label}
        </button>
    );
}