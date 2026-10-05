import ResearchContainer from "@/src/features/research/ResearchContainer";
import { TabType } from "@/src/features/research/Research.type";

export default async function ResearchPage(
  props: Readonly<{
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab;
  const activeTab: TabType =
    tab === "papers" || tab === "projects" ? tab : "researchers";

  return (
    <main className="flex-1 w-full flex flex-col items-end relative overflow-hidden pt-10 font-main">
      {/* Hero Section */}
      <section className="w-full pt-26 px-4 flex flex-col items-center text-center gap-2">
        <h1 className="text-4xl md:text-h1-sm font-bold text-neutral-50 tracking-eyebrow">
          Research & Discovery Hub
        </h1>
        <p className="text-neutral-50 text-lg max-w-2xl">
          Explore researchers, academic papers, and real-world projects from
          institutions worldwide.
        </p>
      </section>

      {/* Main Interactive Section */}
      <ResearchContainer activeTab={activeTab} />
    </main>
  );
}
