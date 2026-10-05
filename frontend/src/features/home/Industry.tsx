"use client";

import Badge from "@/src/components/ui/Badge/Badge";
import Card from "@/src/components/ui/Card/Card";
import CompanyIcon from "@iconify-react/mdi/company";
import FireIcon from "@iconify-react/mdi/fire";

const cards = [
  {
    badgeString: "trindeing",
    title: "lorem",
    description: "lorem ipsum dolor sit amet",
    icon: <CompanyIcon />,
    intent: "primary",
    cardAction: "browse companies",
  },
  {
    badgeString: "explore the news",
    title: "lorem",
    description: "lorem ipsum dolor sit amet",
    icon: <CompanyIcon />,
    intent: "accent",
    cardAction: "browse companies",
  },
];

const Industry = () => {
  return (
    <div className="mx-auto flex flex-col w-full lg:w-316.25 px-5 py-6 lg:items-start lg:pt-25 lg:pb-13.5 gap-2.5 overflow-hidden">
      <div className="flex flex-col gap-2.5 max-w-316.25">
        <p className="font-main font-normal text-primary-200 text-h2-sm lg:text-h2 capitalize">
          expolre the industry
        </p>
        <p className="font-main font-normal text-neutral-100 text-eyebrow lg:text-[24px]">
          discover companies and find the right opportunity to start your
          career.
        </p>
      </div>
      <div className="flex flex-col mx-auto w-full lg:flex-row lg:gap-15 gap-2.5 max-w-316.25 py-2.5 lg:p-2.5">
        {cards.map((card, index) => (
          <Card
            key={index}
            badge={
              <Badge
                variant="solid"
                intent={card.intent as "primary" | "accent"}
                leftIcon={<FireIcon height="24" />}
              >
                {card.badgeString}
              </Badge>
            }
            icon={<CompanyIcon />}
            align="start"
            intent={card.intent as "primary" | "accent"}
            variant="outlined"
            title={card.title}
            description={card.description}
            clickable
            callToAction={"lorem"}
            className="flex-1 w-full items-start border!"
          />
        ))}
      </div>
    </div>
  );
};

export default Industry;
