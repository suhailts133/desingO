import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    placeholder?: string;
    options: string[]; 
    registration?: UseFormRegisterReturn;
}

export function SelectField({ label, error, placeholder, options, registration, className = "", ...props }: SelectFieldProps) {
    return (
        <div>
            <label className="block text-sm font-Jost-Semibold text-gray-700 mb-1">
                {label}
            </label>

            <div className="relative">
                <select
                    className={`auth-input ${className}`}
                    defaultValue=""
                    {...registration}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

              
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            {error && <p className="text-sm text-error mt-1">{error}</p>}
        </div>
    );
}