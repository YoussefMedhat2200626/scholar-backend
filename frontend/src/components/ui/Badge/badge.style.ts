import { BadgeIntent, BadgeSize, BadgeVariant } from "./badge.type";

const getBadgeStyle = (
  intent: BadgeIntent,
  variant: BadgeVariant,
  size: BadgeSize = "sm",
): string => {
  const base = "inline-flex items-center rounded-3xl font-main";

  const sizes: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-4 py-1 text-sm",
    lg: "px-6 py-1.5 text-base",
  };

  const variants: Record<BadgeVariant, Record<BadgeIntent, string>> = {
    solid: {
      primary: "bg-primary-200 text-neutral-800",
      secondary: "bg-neutral-100 text-neutral-900",
      accent: "bg-accent-300 text-neutral-800",
    },
    outlined: {
      primary: "border-2 border-primary-200 text-primary-200",
      secondary: "border-2 border-neutral-100 text-neutral-100",
      accent: "border-2 border-accent-300 text-accent-300",
    },
  };
  return `${base} ${sizes[size]}  ${variants[variant][intent]}`;
};

export default getBadgeStyle;
