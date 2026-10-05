import { ButtonIntent } from "../Button/button.type";
import { CardIntent, CardVariant } from "./card.type";

const getCardClasses = (
  variant: CardVariant,
  intent: CardIntent,
  align: "start" | "center" | "end",
): string => {
  const base = `flex flex-col gap-[10px] overflow-hidden rounded-3xl px-6 py-7 items-${align} transition-all ease-in-out duration-500 font-main `;

  const variants: Record<CardVariant, Record<CardIntent, string>> = {
    solid: {
      primary:
        "bg-primary-700/50 text-primary-100 hover:shadow-[0px_0px_15px_2px_#4EABE9] focus:shadow-[0px_0px_20px_#4EABE9] focus:bg-primary-500/60 focus:outline-none ",
      secondary:
        "bg-neutral-100 text-neutral-900 hover:shadow-[0px_0px_15px_2px_#BDC3C7]  focus:shadow-[0px_0px_20px_#BDC3C7] focus:bg-neutral-200/60 focus:outline-none ",
      accent:
        "bg-accent-600/50 text-accent-200 hover:shadow-[0px_0px_15px_2px_#52E3D6] focus:shadow-[0px_0px_20px_#52E3D6] focus:bg-accent-400/60 focus:outline-none ",
    },
    outlined: {
      primary:
        "border-2 border-primary-400 text-primary-400 hover:border-primary-300 hover:text-primary-300 hover:[box-shadow:0px_0px_10px_#70B5DF]",
      secondary:
        "border-2 border-neutral-200 text-neutral-200 hover:border-neutral-100 hover:text-neutral-100  hover:[box-shadow:0px_0px_10px_#BDC3C7]",
      accent:
        "border-2 border-accent-400 text-accent-400 hover:border-accent-200 hover:text-accent-200 hover:[box-shadow:0px_0px_10px_#7DD3CB]",
    },
  };

  return `${variants[variant][intent]} ${base}`;
};

export const getDescAndBtnClasses = (
  variant: CardVariant,
  intent: CardIntent,
): {
  btnIntent: ButtonIntent;
  descColor: string;
} => {
  const variants: Record<
    CardVariant,
    Record<CardIntent, { btnIntent: ButtonIntent; descColor: string }>
  > = {
    solid: {
      primary: {
        btnIntent: "primary",
        descColor: "text-primary-200",
      },
      accent: {
        btnIntent: "accent",
        descColor: "text-accent-300",
      },
      secondary: {
        btnIntent: "secondary",
        descColor: "text-neutral-200",
      },
    },
    outlined: {
      primary: {
        btnIntent: "primary",
        descColor: "text-neutral-100",
      },
      accent: {
        btnIntent: "accent",
        descColor: "text-neutral-300",
      },
      secondary: {
        btnIntent: "secondary",
        descColor: "text-neutral-200",
      },
    },
  };
  return {
    btnIntent: variants[variant][intent].btnIntent,
    descColor: variants[variant][intent].descColor,
  };
};

export default getCardClasses;
