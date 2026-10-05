const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix Imports
if (content.includes("import { CompanyMeta } from '@/src/data/companies';")) {
  content = content.replace(
    "import { CompanyMeta } from '@/src/data/companies';",
    "import { CompanyMeta, COMPANIES_META } from '@/src/data/companies';"
  );
} else if (!content.includes("COMPANIES_META")) {
    content = content.replace("import { CompanyMeta }", "import { CompanyMeta, COMPANIES_META }");
}

if (!content.includes('ChevronUp')) {
  content = content.replace(
    "Map } from 'lucide-react';",
    "Map, ChevronUp, Check } from 'lucide-react';"
  );
}

// 2. Add State for Sidebar
const stateInsertionPoint = "const [searchQuery, setSearchQuery] = useState('');";
const stateCode = `const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompaniesFilter, setSelectedCompaniesFilter] = useState<string[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  
  const handleToggleCompany = (company: string) => {
    setSelectedCompaniesFilter(prev => 
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };`;
content = content.replace(stateInsertionPoint, stateCode);

// 3. Remove old selectedCompany logic in filteredJobs (if it still exists)
content = content.replace(/if\s*\(selectedCompany\)\s*\{\s*result\s*=\s*result\.filter\(job\s*=>\s*\{\s*return\s*normalizeCompany\(job\.company\s*\|\|\s*''\)\.toLowerCase\(\)\s*===\s*selectedCompany\.toLowerCase\(\);\s*\}\);\s*\}/g, "");
// Add new selectedCompaniesFilter logic
content = content.replace(
  "if (selectedDiscipline) {",
  `if (selectedCompaniesFilter.length > 0) {
      result = result.filter(job => {
        return selectedCompaniesFilter.includes(normalizeCompany(job.company || ''));
      });
    }

    if (selectedDiscipline) {`
);
// Also update dependency array for filteredJobs
content = content.replace(
  "[initialJobs, searchQuery, selectedCompany, selectedDiscipline, selectedCountries]",
  "[initialJobs, searchQuery, selectedCompaniesFilter, selectedDiscipline, selectedCountries]"
);

// 4. Calculate Main vs Other companies
const uniqueCompaniesRender = `const uniqueCompanies = useMemo(() => {`;
const companiesSplitLogic = `
  const mainCompanyNames = useMemo(() => COMPANIES_META.map(c => c.name), []);
  const mainCompaniesList = useMemo(() => {
    return uniqueCompanies.filter(c => mainCompanyNames.includes(c) || COMPANIES_META.some(m => m.shortName === c));
  }, [uniqueCompanies, mainCompanyNames]);
  const otherCompaniesList = useMemo(() => {
    return uniqueCompanies.filter(c => !mainCompaniesList.includes(c));
  }, [uniqueCompanies, mainCompaniesList]);
  
  const filteredMainCompanies = useMemo(() => {
    return mainCompaniesList.filter(c => c.toLowerCase().includes(companySearchQuery.toLowerCase()));
  }, [mainCompaniesList, companySearchQuery]);
  const filteredOtherCompanies = useMemo(() => {
    return otherCompaniesList.filter(c => c.toLowerCase().includes(companySearchQuery.toLowerCase()));
  }, [otherCompaniesList, companySearchQuery]);
`;
// We will insert `companiesSplitLogic` right after `uniqueCompanies` definition ends.
// Let's just find `return ( <div className="min-h-screen` and insert it right above.
content = content.replace(
  "return (\n    <div className=\"min-h-screen",
  companiesSplitLogic + "\n  return (\n    <div className=\"min-h-screen"
);

// 5. Layout changes
const mainContentOld = `{filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#1a2332]/50 rounded-2xl border border-white/5">
                <AlertCircle className="w-12 h-12 text-neutral-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                <p className="text-neutral-400">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                ))}
              </div>
            )}`;
            
const sidebarUI = `<div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Brands/Companies Filter */}
              <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
                <div className="bg-[#1a2332]/80 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white tracking-wide uppercase">Brand</h3>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  
                  {/* Search Companies */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <Search className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-[#111827]/50 border border-white/5 text-neutral-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-white/20 placeholder-neutral-500"
                      placeholder="Search"
                      value={companySearchQuery}
                      onChange={(e) => setCompanySearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Company Checkboxes */}
                  <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                    {filteredMainCompanies.map(company => (
                      <label key={company} className="flex items-center gap-3 cursor-pointer group">
                        <div className={\`w-5 h-5 rounded flex items-center justify-center border transition-all \${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-[#111827]/50 border-white/10 group-hover:border-white/30'}\`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-[#0a0f18] font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-300 group-hover:text-white transition-colors truncate">{company}</span>
                      </label>
                    ))}

                    {showAllCompanies && filteredOtherCompanies.map(company => (
                      <label key={company} className="flex items-center gap-3 cursor-pointer group">
                        <div className={\`w-5 h-5 rounded flex items-center justify-center border transition-all \${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-[#111827]/50 border-white/10 group-hover:border-white/30'}\`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-[#0a0f18] font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-400 group-hover:text-neutral-200 transition-colors truncate">{company}</span>
                      </label>
                    ))}
                  </div>

                  {/* Show All Toggle */}
                  {(otherCompaniesList.length > 0 || (companySearchQuery && filteredOtherCompanies.length > 0)) && (
                    <button
                      onClick={() => setShowAllCompanies(!showAllCompanies)}
                      className="mt-4 text-sm font-semibold text-[#70B5DF] hover:text-[#5da0c9] transition-colors w-full text-left"
                    >
                      {showAllCompanies ? "See Less" : "See All"}
                    </button>
                  )}
                </div>
              </aside>

              {/* Main Content - Jobs Grid */}
              <div className="flex-1">
                {filteredJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-[#1a2332]/50 rounded-2xl border border-white/5">
                    <AlertCircle className="w-12 h-12 text-neutral-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                    <p className="text-neutral-400">Try adjusting your filters or search query.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredJobs.map(job => (
                      <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                    ))}
                  </div>
                )}
              </div>
            </div>`;
            
content = content.replace(mainContentOld, sidebarUI);

// 6. Remove Companies Dropdown from Filter Bar
const companiesDropdownRegex = /\{\/\*\s*Companies Dropdown\s*\*\/\}\s*<CustomSelect\s*value=\{selectedCompany\}\s*onChange=\{setSelectedCompany\}\s*placeholder="All Companies"\s*options=\{uniqueCompanies\.map\(c => \(\{ label: c, value: c \}\)\)\}\s*searchable\s*\/>/g;
content = content.replace(companiesDropdownRegex, "");

fs.writeFileSync(path, content, 'utf8');
console.log('Sidebar UI applied');
