import ResearchTabsClient from "./ResearchTabsClient";
import ResearchInfoCard, { ResearchInfoCardProps } from "./ResearchInfoCard";
import ResearchContent from "./ResearchContent";
import { TabType } from "./Research.type";

const RESEARCH_DATA: Record<TabType, ResearchInfoCardProps> = {
  researchers: {
    title: "Explore Researchers",
    description:
      "Browse academic profiles, research areas, and publications to find experts in your field",
    stats: [
      { label: "Researchers", value: 879 },
      { label: "Universities", value: 481 },
      { label: "Topics", value: 17 },
    ],
  },
  papers: {
    title: "Discover Academic Papers",
    description:
      " Explore academic papers and citation networks across top journals and research platforms.",
  },
  projects: {
    title: "Explore Graduation Projects",
    description:
      "Discover real student projects, explore ideas, and get inspired for your own work",
  },
};

const ResearchContainer = ({ activeTab }: { activeTab: TabType }) => {
  const currentInfo = RESEARCH_DATA[activeTab];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col pt-8 pb-24 px-4 md:px-8 tracking-eyebrow">
      {/* Info Card */}
      <ResearchInfoCard
        title={currentInfo.title}
        description={currentInfo.description}
        stats={currentInfo.stats}
      />

      {/* Tabs */}
      <ResearchTabsClient activeTab={activeTab} />

      {/* Content */}
      <ResearchContent activeTab={activeTab} />
    </div>
  );
};

export default ResearchContainer;
