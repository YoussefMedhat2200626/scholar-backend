import { ButtonIntent, ButtonSize, ButtonVariant } from "./button.type";

interface ButtonProps {
  variant: ButtonVariant;
  intent: ButtonIntent;
  size?: ButtonSize;
  disabled?: boolean;
}

// Size scales per variant — each tuned for its visual role
const solidSizes: Record<ButtonSize, string> = {
  sm:  "text-xs  py-0.5 px-2   rounded-lg  gap-1",
  md:  "text-sm  py-1   px-3   rounded-xl  gap-1.5",
  lg:  "text-base py-1.5 px-4  rounded-xl  gap-2",
  xl:  "text-lg  py-2   px-5   rounded-2xl gap-2",
  "2xl": "text-xl py-2.5 px-6  rounded-xl gap-2.5",
};

const linkSizes: Record<ButtonSize, string> = {
  sm:  "text-xs  gap-1",
  md:  "text-sm  gap-1.5",
  lg:  "text-base gap-2",
  xl:  "text-lg  gap-2",
  "2xl": "text-xl gap-2.5",
};

// Icon buttons: square-ish, radial bg on hover — size controls the icon tap target
const iconSizes: Record<ButtonSize, string> = {
  sm:  "text-sm  p-0.5 rounded-lg",
  md:  "text-base p-1   rounded-xl",
  lg:  "text-lg  p-1.5 rounded-xl",
  xl:  "text-xl  p-2   rounded-2xl",
  "2xl": "text-2xl p-2.5 rounded-2xl",
};

const outlinedSizes: Record<ButtonSize, string> = {
  sm:  "text-xs  py-0.5 px-2   rounded-lg",
  md:  "text-sm  py-1   px-3   rounded-xl",
  lg:  "text-base py-1.5 px-4  rounded-xl",
  xl:  "text-lg  py-2   px-5   rounded-2xl",
  "2xl": "text-xl py-2.5 px-6  rounded-xl",
};

const getSizeClasses = (variant: ButtonVariant, size: ButtonSize): string => {
  switch (variant) {
    case "solid":    return solidSizes[size];
    case "link":     return linkSizes[size];
    case "icon":     return iconSizes[size];
    case "outlined": return outlinedSizes[size];
    default:         return solidSizes[size];
  }
};

const getButtonClasses = ({ variant, intent, size = "md", disabled = false }: ButtonProps) => {
  const base =
    "relative group overflow-hidden font-main hover:from-20% hover:cursor-pointer flex items-center justify-center transition-all ease-in-out duration-500 active:scale-95 ";

  const variants: Record<ButtonVariant, Record<ButtonIntent, string>> = {
    solid: {
      primary:   "bg-primary-500 text-neutral-50",
      secondary: "bg-neutral-100 text-neutral-900",
      accent:    "bg-accent-600 text-neutral-50",
      danger:    "bg-transparent text-neutral-50",
    },
    link: {
      primary:   "text-primary-500 hover:text-primary-300",
      secondary: "text-neutral-200 hover:text-neutral-100",
      accent:    "text-accent-400 hover:text-accent-200",
      danger:    "text-danger-300 hover:text-danger-600",
    },
    icon: {
      primary:
        "text-primary-500 hover:text-primary-200 hover:bg-[radial-gradient(circle_at_center,#B3DAF233_0%,transparent_100%)]",
      secondary:
        "text-neutral-200 hover:text-neutral-100 hover:bg-[radial-gradient(circle_at_center,#BDC3C733_0%,transparent_100%)]",
      accent:
        "text-accent-400 hover:text-accent-200 hover:bg-[radial-gradient(circle_at_center,#6FBCB733_0%,transparent_100%)]",
      danger:
        "text-danger-200 hover:text-danger-400 hover:bg-[radial-gradient(circle_at_center,#FF453833_0%,transparent_100%)]",
    },
    outlined: {
      primary:
        "border-2 border-primary-500 text-primary-500 hover:text-primary-300 hover:border-primary-300 hover:shadow-[0px_0px_10px_#8ED4FF]",
      secondary:
        "border-2 border-neutral-200 text-neutral-200 hover:text-neutral-100 hover:border-neutral-100 hover:shadow-[0px_0px_10px_#BDC3C7]",
      accent:
        "border-2 border-accent-400 text-accent-400 hover:text-accent-200 hover:border-accent-200 hover:shadow-[0px_0px_10px_#B9F1EC]",
      danger:
        "border-2 border-danger-300 text-danger-300 hover:text-danger-400 hover:border-danger-400 hover:shadow-[0px_0px_10px_#F81506]",
    },
  };

  const sizeClasses = getSizeClasses(variant, size);
  const disabledClasses = disabled ? "opacity-50 pointer-events-none cursor-default" : "";

  return `${base} ${variants[variant][intent]} ${sizeClasses} ${disabledClasses}`;
};

export default getButtonClasses;

export const getHoverOverlay = (
  intent: ButtonIntent,
  variant: ButtonVariant,
) => {
  const overlays: Partial<Record<ButtonVariant, Record<ButtonIntent, string>>> =
    {
      solid: {
        primary:   "from-primary-300 to-primary-700",
        secondary: "from-neutral-100 to-neutral-500",
        accent:    "from-accent-300 to-accent-800",
        danger:    "from-danger-400 to-danger-600",
      },
    };

  return overlays[variant]?.[intent] ?? "";
};