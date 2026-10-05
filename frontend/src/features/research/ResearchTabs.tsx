import { FC } from "react";
import { TabType } from "./Research.type";

interface ResearchTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: "researchers", label: "Researchers" },
  { id: "papers", label: "Papers" },
  { id: "projects", label: "Projects" },
];

const ResearchTabs: FC<ResearchTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex w-full items-end gap-0.5 mt-7 z-10 relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <span
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 text-center sm:flex-none px-1 sm:px-14.5 py-1.5 rounded-t-[18px] transition-all ease-in-out duration-500 font-normal text-sm sm:text-lg ${
              isActive
                ? "bg-transparent text-accent-200 border-t-4 border-x border-accent-200 font-semibold py-2"
                : "bg-accent-700 text-neutral-50 cursor-pointer"
            }`}
          >
            {tab.label}
          </span>
        );
      })}
    </div>
  );
};

export default ResearchTabs;
