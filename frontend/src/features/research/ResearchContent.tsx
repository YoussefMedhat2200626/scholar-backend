"use client";

import { FC } from "react";
import { Input } from "@/src/components/ui/InputField/Input";
import dynamic from "next/dynamic";
import notFoundAnimation from "@/src/components/assets/NotFound.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export interface ResearchContentProps {
  activeTab: string;
}

const CONTENT_DATA: Record<
  string,
  {
    filters: string[];
    emptyTitle: string;
    emptyDesc: string;
    placeholder: string;
  }
> = {
  researchers: {
    filters: ["Topics", "Research Fields", "Universities"],
    emptyTitle: "Find What You're Looking For",
    emptyDesc: "Choose Topics, Keywords, Or Universities To Begin Your Search.",
    placeholder: "by Researcher Name",
  },
  papers: {
    filters: ["Year"],
    emptyTitle: "Start Your Paper Search",
    emptyDesc:
      "Search by keywords, paste an abstract, or filter by year to find the most relevant research",
    placeholder: "Paper",
  },
  projects: {
    filters: ["Universities", "Project Field", "Year", "Sponsorship"],
    emptyTitle: "Find What You're Looking For",
    emptyDesc: "Choose topics, keywords, or universities to begin your search.",
    placeholder: "by title, student or supervisor",
  },
};

const ResearchContent: FC<ResearchContentProps> = ({ activeTab }) => {
  const currentContent = CONTENT_DATA[activeTab] || CONTENT_DATA.researchers;

  return (
    <div className="w-full bg-transparent border-2 border-accent-200 rounded-b-2xl rounded-tr-2xl p-6 min-h-100 flex flex-col gap-12 relative -mt-px">
      {/* Top action bar */}
      <div className="flex gap-4 items-center">
        <div className="w-75">
          <Input placeholder={`Search ${currentContent.placeholder}`} />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2">
          {currentContent.filters.map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-full border border-[#4d6e7c] text-neutral-300 text-sm flex items-center gap-2"
            >
              {filter} <span className="text-[10px]">▼</span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center pt-10.5 pb-16 gap-2.5">
        <div className="relative flex items-center justify-center">
          <Lottie
            animationData={notFoundAnimation}
            loop={true}
            className="w-64 mx-auto"
          />
        </div>
        <h3 className="text-2xl font-semibold text-accent-300">
          {currentContent.emptyTitle}
        </h3>
        <p className="text-neutral-100">{currentContent.emptyDesc}</p>
      </div>
    </div>
  );
};

export default ResearchContent;
