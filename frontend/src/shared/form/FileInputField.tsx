import React, { useId } from "react";
import { Paperclip } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FileInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label: string;
    fileName?: string;
    placeholder?: string;
    error?: string;
    registration?: UseFormRegisterReturn;
}

export function FileInputField({ label, fileName, placeholder = "Choose an image...", error, registration, accept = "image/jpeg,image/png,image/jpg,image/webp", className = "", id, ...props }: FileInputFieldProps) {
    const generatedId = useId();
    const inputId = id || registration?.name || generatedId;

    return (
        <div className="w-full">
            
            <label
                htmlFor={inputId}
                className="block text-sm font-Jost-Semibold text-gray-700 mb-1"
            >
                {label}
            </label>

            <label
                htmlFor={inputId}
                className={`flex items-center gap-3 w-full border rounded-lg px-4 py-2 cursor-pointer transition-colors bg-white/50 ${error
                    ? "border-error text-error"
                    : "border-gray-300 hover:border-blush-deep"
                    } ${className}`}
            >
                <Paperclip className="h-5 w-5 text-gray-400 shrink-0" />

                <span
                    className={`text-sm truncate ${fileName ? "text-soft-black font-medium" : "text-gray-400"
                        }`}
                >
                    {fileName || placeholder}
                </span>
            </label>

            <input
                id={inputId}
                type="file"
                accept={accept}
                className="hidden"
                {...registration}
                {...props}
            />

        
            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}