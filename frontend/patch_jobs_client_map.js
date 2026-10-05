const fs = require('fs');
const path = 'src/app/jobs/JobsClient.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
if (!content.includes('import MapFilterModal')) {
  content = content.replace(
    "import CompanyModal from './components/CompanyModal';",
    "import CompanyModal from './components/CompanyModal';\nimport MapFilterModal from './components/MapFilterModal';"
  );
}

if (!content.includes('Map,')) {
  content = content.replace(
    "Search, ChevronDown, User, Briefcase, Code, Globe, AlertCircle",
    "Search, ChevronDown, User, Briefcase, Code, Globe, AlertCircle, Map"
  );
}

// 2. States
const stateInsertionPoint = "const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyMeta | null>(null);";
const stateCode = `const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyMeta | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  
  const handleToggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };
`;
content = content.replace(stateInsertionPoint, stateCode);

// 3. filteredJobs dependencies and logic
content = content.replace(
  "return result;\n  }, [initialJobs, searchQuery, selectedCompany, selectedDiscipline]);",
  `
    if (selectedCountries.length > 0) {
      result = result.filter(job => {
        if (!job.location) return false;
        // Standardize somewhat, or just do simple string includes
        return selectedCountries.some(country => job.location!.toLowerCase().includes(country.toLowerCase()));
      });
    }

    return result;
  }, [initialJobs, searchQuery, selectedCompany, selectedDiscipline, selectedCountries]);`
);

// 4. UI Button
const searchInputStr = `{/* Search Input */}
          <div className="relative flex-1">`;
const buttonStr = `{/* Select Countries Button */}
          <button 
            onClick={() => setIsMapModalOpen(true)}
            className="flex items-center gap-2 bg-[#111827]/50 border border-white/5 text-neutral-200 text-sm rounded-xl py-3.5 px-5 hover:bg-white/10 transition-colors shrink-0 whitespace-nowrap lg:max-w-[200px]"
          >
            <Map className="w-4 h-4 text-neutral-400 shrink-0" />
            <span className="truncate">Select Countries ({selectedCountries.length})</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1">`;
content = content.replace(searchInputStr, buttonStr);

// 5. Render Modal
const renderEnd = `<JobModal `;
const newRenderEnd = `<MapFilterModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedCountries={selectedCountries}
        onToggleCountry={handleToggleCountry}
        onConfirm={() => setIsMapModalOpen(false)}
      />
      
      <JobModal `;
content = content.replace(renderEnd, newRenderEnd);

fs.writeFileSync(path, content, 'utf8');
console.log('JobsClient patched for MapFilterModal');
