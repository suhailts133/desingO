import React, { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    registration?: UseFormRegisterReturn;
}

export function TextAreaField({ label, error, rows = 4, registration, className = "", id, ...props }: TextAreaFieldProps) {
    const generatedId = useId();
    const textareaId = id || registration?.name || generatedId;

    return (
        <div className="w-full">
            <label
                htmlFor={textareaId}
                className="block text-sm font-Jost-Semibold text-gray-700 mb-1"
            >
                {label}
            </label>

            <div className="relative">
                <textarea
                    id={textareaId}
                    rows={rows}
                    className={`auth-input resize-y ${className}`}
                    {...registration}
                    {...props}
                />
            </div>

            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}