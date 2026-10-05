"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ResearchTabs from "./ResearchTabs";
import { TabType } from "./Research.type";

interface ResearchTabsClientProps {
	activeTab: TabType;
}

export default function ResearchTabsClient({
	activeTab,
}: Readonly<ResearchTabsClientProps>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleTabChange = (tab: TabType) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", tab);
		// Using push, but can use replace if preferred. We'll use push as a default or replace if better.
		// The user didn't explicitly answer the question about push vs replace, so I'll use replace as it's typically better for tabs.
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return <ResearchTabs activeTab={activeTab} onTabChange={handleTabChange} />;
}

