import { ReactNode } from "react";
import { CardVariant, CardIntent } from "./card.type";
import getCardClasses, { getDescAndBtnClasses } from "./card.style";
import Button from "../Button/Button";
import { Icon } from "@iconify/react";
import { ButtonIntent } from "../Button/button.type";

interface CardProps {
  variant?: CardVariant;
  intent?: CardIntent;
  btnIntent?: ButtonIntent
  icon?: ReactNode;
  badge?: ReactNode;
  callToAction?: string;
  title?: string;
  description?: string;
  className?: string;
  align?: "start" | "center" | "end";
  clickable?: boolean;
}


const Card = ({
  intent = "primary",
  variant = "solid",
  btnIntent = intent,
  icon,
  badge,
  title = "card title",
  description,
  callToAction,
  className = "",
  align = "start",
  clickable = false,
}: CardProps) => {
  const { descColor } = getDescAndBtnClasses(variant, intent);
  return (
    <div
      tabIndex={clickable ? 0 : undefined}
      className={`${getCardClasses(variant, intent, align)} ${className} `}
    >
      {(icon || badge) && (
        <div className="flex items-center justify-between w-full">
          {icon && <span className="w-17 h-17">{icon}</span>}
          {badge && <span>{badge}</span>}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {title && (
          <h2 className="text-2xl capitalize text-neutral-50">{title}</h2>
        )}
        {description && <p className={`${descColor} text-lg`}>{description}</p>}
      </div>
      {callToAction && (
        <Button
          intent={btnIntent}
          variant="link"
          iconRight={<Icon className="h-full" icon="fe:arrow-right" />}
        >
          {callToAction}
        </Button>
      )}
    </div>
  );
};

export default Card;
