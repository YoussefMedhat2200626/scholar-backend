import { ReactNode } from "react";
import { BadgeVariant, BadgeIntent, BadgeSize } from "./badge.type";
import getBadgeStyle from "./badge.style";

export interface BadgeProps {
  variant: BadgeVariant;
  intent: BadgeIntent;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

const Badge = ({
  intent = "primary",
  variant = "solid",
  size,
  leftIcon,
  rightIcon,
  children,
  className = "",
  textTransform = "capitalize",
}: BadgeProps) => {
  return (
    <div
      className={`${getBadgeStyle(intent, variant, size)} ${className} ${textTransform} `}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </div>
  );
};

export default Badge;
