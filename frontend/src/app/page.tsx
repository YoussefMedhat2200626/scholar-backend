import {
  HeroSection,
  GrowthInsights,
  Industry,
  AcademicEcosystem,
} from "@/src/features/home";

export default function Home() {
  const stats = { researches: null, companies: "233", projects: "31" };
  return (
    <main className="overflow-hidden flex flex-col gap-2.5 last:gap-0">
      <HeroSection />
      <GrowthInsights
        stats={[
          { value: stats.researches ?? null, label: "Researches" },
          { value: stats.companies ?? null, label: "Company" },
          { value: stats.projects ?? null, label: "Project" },
        ]}
      />
      <Industry />
      <AcademicEcosystem />
    </main>
  );
}
