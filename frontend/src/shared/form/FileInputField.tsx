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
                className="block text-sm font-Jost-Semibold text-text-primary mb-1"
            >
                {label}
            </label>

            <label
                htmlFor={inputId}
                className={`flex items-center gap-3 w-full border rounded-lg px-4 py-2 cursor-pointer transition-colors bg-surface-hover ${error
                    ? "border-error text-error"
                    : "border-surface-border hover:border-accent"
                    } ${className}`}
            >
                <Paperclip className="h-5 w-5 text-text-faint shrink-0" />

                <span
                    className={`text-sm truncate ${fileName ? "text-text-primary font-medium" : "text-text-faint"
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

        
            {error && <p className="text-sm text-error-text mt-1">{error}</p>}
        </div>
    );
}