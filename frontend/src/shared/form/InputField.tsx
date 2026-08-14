import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    showPasswordToggle?: boolean;
    registration?: UseFormRegisterReturn;
}

export function InputField({ label, error, type = "text", showPasswordToggle = false, registration, className = "", ...props }: InputFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const resolvedType = showPasswordToggle ? isPasswordVisible ? "text" : "password" : type;

    return (
        <div >
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                {label}
            </label>


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
                        className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-gray-700"
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

            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}