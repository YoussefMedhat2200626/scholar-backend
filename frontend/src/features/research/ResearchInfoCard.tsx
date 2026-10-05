import { User } from "@/src/components/Icons/User";
import { Document } from "@/src/components/Icons/Document";
import { Browser } from "@/src/components/Icons/Browser";
import { FC } from "react";
import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";

export interface StatItem {
  label: string;
  value: string | number;
}

export interface ResearchInfoCardProps {
  title: string;
  description: string;
  stats?: StatItem[];
}

const ResearchInfoCard: FC<ResearchInfoCardProps> = ({
  title,
  description,
  stats,
}) => {
  const renderIcon = () => {
    if (title.includes("Researchers")) return <User />;
    if (title.includes("Papers")) return <Document />;
    if (title.includes("Projects")) return <Browser />;
  };
  return (
    <div className="relative z-0 w-full rounded-3xl bg-white/10 px-4.5 py-3.5 flex flex-col md:flex-row gap-5">
      <div className="w-2 rounded-full bg-primary-200 shrink-0" />
      <div className="hidden lg:block absolute top-[-74%] left-[82%] w-73.5 h-54">
        <LightingGlow variant="accent" className="blur-[150px]" />
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-2xl font-bold text-primary-200 flex items-center gap-2.5">
            {renderIcon()}
            {title}
          </h2>
          <p className="text-neutral-50 text-lg font-normal">{description}</p>
        </div>

        {stats && (
          <div className="flex items-start md:items-center flex-col md:flex-row gap-6 rounded-xl bg-white/10 px-2.5">
            {stats?.map((stat, index) => (
              <div key={index} className="flex items-center gap-1 p-1.5">
                <span className="text-2xl font-bold text-primary-300">
                  {stat.value}
                </span>
                <span className="text-white font-medium text-subtext">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchInfoCard;
