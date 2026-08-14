// shared/form/InputField.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAction?: React.ReactNode; // <-- Added to hold links like "Forgot Password?"
  error?: string;
  showPasswordToggle?: boolean;
  registration?: UseFormRegisterReturn;
}

export function InputField({
  label,
  labelAction,
  error,
  type = "text",
  showPasswordToggle = false,
  registration,
  className = "",
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div>
      {/* Label + Label Action container */}
      {(label || labelAction) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <label className="block text-sm font-Jost-Semibold text-gray-700">
              {label}
            </label>
          )}
          {labelAction && <div>{labelAction}</div>}
        </div>
      )}

      {/* Input container */}
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
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
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