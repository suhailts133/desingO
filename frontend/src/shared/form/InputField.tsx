import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    showPasswordToggle?: boolean;
    registration?: UseFormRegisterReturn;
    labelAction?: React.ReactNode;
}

export function InputField({
    label,
    error,
    type = "text",
    showPasswordToggle = false,
    registration,
    labelAction,
    className = "",
    ...props
}: InputFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const resolvedType = showPasswordToggle
        ? isPasswordVisible
            ? "text"
            : "password"
        : type;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-Jost-Semibold text-text-primary">
                    {label}
                </label>
                {labelAction}
            </div>

            <div className="relative">
                <input
                    type={resolvedType}
                    className={`auth-input ${className}`}
                    {...registration}
                    {...props}
                />

                {showPasswordToggle && (
                    <button
                        type="button"
                        className="absolute right-3 inset-y-0 flex items-center text-accent hover:text-accent-hover"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                        {isPasswordVisible ? (
                            <Eye size={20} strokeWidth={2} />
                        ) : (
                            <EyeOff size={20} strokeWidth={2} />
                        )}
                    </button>
                )}
            </div>

            {error && <p className="text-sm text-error-text mt-1">{error}</p>}
        </div>
    );
}