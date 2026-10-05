"use client";

import { ComponentRef, forwardRef, useState } from "react";
import { InputProps } from "./input.type";
import EyeIcon from "@iconify-react/mdi/eye";
import EyeOffIcon from "@iconify-react/mdi/eye-off";
import { iconVariants, inputVariants, labelVariants } from "./input.style";

export const Input = forwardRef<ComponentRef<"input">, InputProps>(
  (
    {
      label,
      error,
      success,
      endAdornment,
      className,
      disabled,
      type,
      size = "md",
      width = "full",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const hasRightIcon = Boolean(endAdornment || isPassword);

    const hasLabel = Boolean(label);

    const variant = disabled
      ? "disabled"
      : error
        ? "error"
        : success
          ? "success"
          : "default";

    return (
      <div className="w-full font-main">
        <div className="relative">
          <input
            ref={ref}
            disabled={disabled}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            aria-invalid={!!error}
            aria-disabled={disabled}
            className={inputVariants({
              variant,
              hasRightIcon,
              hasLabel,
              size,
              width,
              className,
            })}
            {...props}
          />

          {label && (
            <span className={labelVariants({ variant: variant })}>{label}</span>
          )}

          {hasRightIcon && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  className={iconVariants({ variant: variant })}
                >
                  {showPassword ? (
                    <EyeOffIcon height="1.25rem" />
                  ) : (
                    <EyeIcon height="1.25rem" />
                  )}
                </button>
              ) : (
                <div className={iconVariants({ variant: variant })}>
                  {endAdornment}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";
