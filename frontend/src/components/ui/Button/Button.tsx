import { ReactNode, ButtonHTMLAttributes } from "react";
import { ButtonVariant, ButtonIntent, ButtonSize } from "./button.type";
import getButtonClasses, { getHoverOverlay } from "./button.style";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  size?: ButtonSize;
  children?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

const Button = ({
  variant = "solid",
  intent = "primary",
  size = "lg",
  children = "icon",
  iconLeft,
  iconRight,
  textTransform = "capitalize",
  className = "",
  ...rest
}: ButtonProps) => {
  const overlay = getHoverOverlay(intent, variant);
  return (
    <button
      {...rest}
      className={`${getButtonClasses({ variant, intent, size, disabled: rest.disabled })} ${textTransform} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-1">
        {iconLeft && (
          <span className="group-hover:mr-2 transition-all ease-in-out duration-500">
            {iconLeft}
          </span>
        )}
        {children && (
          <span className={`transition-all ease-in-out duration-500`}>
            {children}
          </span>
        )}
        {iconRight && (
          <span className="group-hover:ml-2 transition-all ease-in-out duration-500">
            {iconRight}
          </span>
        )}
      </span>

      {/* a span for the overlay to make smooth hover effect */}
      <span
        className={`
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-all ease-in-out duration-500
          pointer-events-none
          bg-linear-to-b ${overlay}
        `}
      />
    </button>
  );
};

export default Button;
