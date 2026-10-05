"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import JobModal from './components/JobModal';
import CompanyModal from './components/CompanyModal';
import MapFilterModal from './components/MapFilterModal';
import CompaniesGrid from './components/CompaniesGrid';
import FilterSearchInput from './components/FilterSearchInput';
import { CompanyMeta, COMPANIES_META } from '@/src/data/companies';
import type { CompanyMonthlyStat } from '@/src/lib/jobsDb';
import { Search, ChevronDown, User, Briefcase, Code, Globe, AlertCircle, Map, ChevronUp, Check, MapPin, RotateCcw, MousePointerClick, Filter, X } from 'lucide-react';

const getCompanyColor = (companyName: string) => {
  if (!companyName) return 'bg-emerald-600';
  const lower = companyName.toLowerCase();
  if (lower.includes('siemens')) return 'bg-emerald-600';
  if (lower.includes('capgemini')) return 'bg-emerald-600';
  if (lower.includes('valeo')) return 'bg-emerald-600';
  if (lower.includes('cisco')) return 'bg-slate-700';
  if (lower.includes('vodafone')) return 'bg-red-600';
  if (lower.includes('dell')) return 'bg-blue-600';
  if (lower.includes('stmicroelectronics') || lower.includes('stmicro')) return 'bg-blue-600';
  if (lower.includes('intel')) return 'bg-blue-600';
  if (lower.includes('mediatek')) return 'bg-red-600';
  if (lower.includes('texas instruments') || lower.includes('ti')) return 'bg-red-600';
  if (lower.includes('analog devices') || lower.includes('adi')) return 'bg-slate-600';
  if (lower.includes('infineon')) return 'bg-teal-600';

  const colors = [
    'bg-blue-600',
    'bg-cyan-600',
    'bg-red-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-orange-600',
    'bg-pink-600',
    'bg-indigo-600'
  ];
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface JobData {
  id: string | number;
  source?: string;
  title: string;
  company?: string;
  tags_json?: string;
  location?: string;
  url?: string;
  job_type?: string;
  first_seen_at?: string;
  number_visited?: number;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  searchable = false
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  icon?: any;
  searchable?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
        inputRef.current.focus();
    }
    if (!isOpen) {
        setSearch('');
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(o => o.value === value);
  const filteredOptions = searchable 
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="relative flex-1 lg:max-w-[280px]" ref={ref}>
      {Icon && (
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
          <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        </div>
      )}
      <div 
        className={`w-full bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-neutral-300 text-sm rounded-xl py-3.5 ${Icon ? 'pl-11' : 'pl-5'} pr-10 cursor-pointer flex items-center justify-between transition-all hover:bg-neutral-200/50 dark:hover:bg-white/10 select-none`}
        onClick={() => { if (!isOpen) setIsOpen(true); }}
      >
        {searchable && isOpen ? (
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search..." 
            className="w-full bg-transparent border-none text-neutral-900 dark:text-neutral-200 focus:outline-none focus:ring-0 p-0 m-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        )}
        <ChevronDown 
          className={`absolute right-4 h-4 w-4 text-neutral-500 dark:text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-neutral-600/[0.98] backdrop-blur-xl border border-neutral-200 dark:border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-2">
            <div 
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors select-none ${value === '' ? 'bg-primary-50 dark:bg-cyan-500/10 text-primary-600 dark:text-cyan-400 font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
              onClick={() => { onChange(''); setIsOpen(false); }}
            >
              {placeholder}
            </div>
            {filteredOptions.map((opt) => (
              <div 
                key={opt.value}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors select-none ${value === opt.value ? 'bg-primary-50 dark:bg-cyan-500/10 text-primary-600 dark:text-cyan-400 font-semibold' : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-100'}`}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                {opt.label}
              </div>
            ))}
            {filteredOptions.length === 0 && (
               <div className="px-4 py-2 text-sm text-neutral-400 dark:text-neutral-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobsClient({
  initialJobs,
  companyStats = [],
  serverError
}: {
  initialJobs: JobData[];
  companyStats?: CompanyMonthlyStat[];
  serverError?: string;
}) {

  const normalizeCompany = (c: string) => {
      if (!c) return '';
      const lower = c.toLowerCase();
      if (lower.includes("siemens energy")) return "Siemens Energy";
      if (lower.includes("siemens gamesa")) return "Siemens Gamesa";
      if (lower.includes("siemens digital industries software") || lower.includes("siemens dis") || lower.includes("siemens eda")) return "Siemens Digital Industries Software";
      if (lower.includes("siemens")) return "Siemens";
      if (lower.includes("mixel")) return "Mixel-Egypt";
      if (lower.includes("capgemini")) return "Capgemini";
      if (lower.includes("stmicroelectronics")) return "STMicroelectronics";
      if (lower.includes("analog devices")) return "Analog Devices";
      if (lower.includes("infinilink")) return "InfiniLink";
      if (lower.includes("valeo")) return "Valeo";
      if (lower.includes("iss international spa")) return "ISS INTERNATIONAL SpA";
      return c;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompaniesFilter, setSelectedCompaniesFilter] = useState<string[]>([]);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  
  const handleToggleCompany = (company: string) => {
    setSelectedCompaniesFilter(prev => 
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('jobs');
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyMeta | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

  const countryJobCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (initialJobs || []).forEach(job => {
      if (!job.location) return;
      const loc = job.location.toLowerCase();
      
      let countryName = '';
      if (loc.includes('egypt') || loc.includes('cairo') || loc.includes('alexandria')) {
        countryName = 'Egypt';
      } else if (loc.includes('saudi') || loc.includes('riyadh') || loc.includes('jeddah')) {
        countryName = 'Saudi Arabia';
      } else if (loc.includes('emirates') || loc.includes('uae') || loc.includes('dubai') || loc.includes('abu dhabi')) {
        countryName = 'United Arab Emirates';
      } else if (loc.includes('united states') || loc.includes(' usa') || loc.includes(', us') || loc === 'us' || loc === 'usa' || /(?:,\s*(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))(?:$|,\s*(?:us|usa|united states))/i.test(loc)) {
        countryName = 'United States of America';
      }

      if (countryName) {
        counts[countryName] = (counts[countryName] || 0) + 1;
      }
    });
    return counts;
  }, [initialJobs]);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleApplyClick = async (jobId: string | number) => {
    const key = String(jobId);
    // 1. Optimistic update (+1) for immediate feedback
    const baseCount = visitCounts[key] ?? initialJobs.find(j => String(j.id) === key)?.number_visited ?? 0;
    setVisitCounts(prev => ({
      ...prev,
      [key]: baseCount + 1,
    }));

    // 2. Fetch authoritative count from server and sync
    try {
      const res = await fetch("/api/jobs/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId }),
      });
      const data = await res.json();
      if (data && typeof data.number_visited === "number") {
        setVisitCounts(prev => ({
          ...prev,
          [key]: data.number_visited,
        }));
      }
    } catch (err) {
      console.error("Failed to sync visit count with server:", err);
    }
  };

  const handleToggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const hasActiveFilters = Boolean(searchQuery || selectedDiscipline || selectedSource || selectedCountries.length > 0 || selectedCompaniesFilter.length > 0);

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('');
    setSelectedCountries([]);
    setSelectedCompaniesFilter([]);
    setCompanySearchQuery('');
    setSelectedSource('');
  };


  const filteredJobs = useMemo(() => {
    let result = (initialJobs || []);

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(job => 
        job.title?.toLowerCase().includes(lowerQuery) || 
        job.company?.toLowerCase().includes(lowerQuery) ||
        job.tags_json?.toLowerCase().includes(lowerQuery)
      );
    }

    

    if (selectedSource) {
      result = result.filter(job => job.source?.toLowerCase() === selectedSource.toLowerCase());
    }

    if (selectedCompaniesFilter.length > 0) {
      result = result.filter(job => {
        return selectedCompaniesFilter.includes(normalizeCompany(job.company || ''));
      });
    }

    if (selectedDiscipline) {
      const lowerDiscipline = selectedDiscipline.toLowerCase();
      
      let searchTerms = [lowerDiscipline];
      if (lowerDiscipline === 'backend development') {
        searchTerms = ['backend', 'back-end', 'back end'];
      } else if (lowerDiscipline === 'frontend development') {
        searchTerms = ['frontend', 'front-end', 'front end'];
      } else if (lowerDiscipline === 'full stack development') {
        searchTerms = ['full stack', 'full-stack', 'fullstack'];
      } else if (lowerDiscipline === 'software engineering') {
        searchTerms = ['software', 'swe'];
      } else if (lowerDiscipline === 'hardware engineering') {
        searchTerms = ['hardware'];
      } else if (lowerDiscipline === 'systems engineering') {
        searchTerms = ['systems engineer', 'system engineer'];
      } else if (lowerDiscipline === 'quality assurance') {
        searchTerms = ['quality assurance', 'qa'];
      } else if (lowerDiscipline === 'embedded systems') {
        searchTerms = ['embedded'];
      } else if (lowerDiscipline === 'digital') {
        searchTerms = ['digital'];
      } else if (lowerDiscipline === 'computer engineering') {
        searchTerms = ['computer'];
      } else if (lowerDiscipline === 'electronics engineering') {
        searchTerms = ['electronic'];
      } else {
        const shortened = lowerDiscipline
          .replace(' development', '')
          .replace(' engineering', '')
          .replace(' systems', '');
        if (shortened !== lowerDiscipline) {
          searchTerms.push(shortened);
        }
      }
      
      result = result.filter(job => {
        const lowerTitle = job.title?.toLowerCase() || '';
        let tags: string[] = [];
        try {
          tags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
        } catch {}
        const tagsJoined = tags.join(' ').toLowerCase();

        return searchTerms.some(term => lowerTitle.includes(term) || tagsJoined.includes(term));
      });
    }

    
    if (selectedCountries.length > 0) {
      result = result.filter(job => {
        if (!job.location) return false;
        const loc = job.location.toLowerCase();
        return selectedCountries.some(country => {
          const c = country.toLowerCase();
          if (loc.includes(c)) return true;
          
          if (c === 'united states of america' || c === 'united states' || c === 'usa') {
            const isUS = loc.includes('united states') || loc.includes(' usa') || loc.includes(', us') || loc === 'us' || loc === 'usa' || /(?:,\s*(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))(?:$|,\s*(?:us|usa|united states))/i.test(loc);
            return isUS;
          }
          if (c === 'saudi arabia') {
            return loc.includes('saudi') || loc.includes('riyadh') || loc.includes('jeddah');
          }
          if (c === 'united arab emirates') {
            return loc.includes('emirates') || loc.includes('uae') || loc.includes('dubai') || loc.includes('abu dhabi');
          }
          if (c === 'egypt') {
            return loc.includes('egypt') || loc.includes('cairo') || loc.includes('alexandria');
          }
          return false;
        });
      });
    }

    return result;
  }, [initialJobs, searchQuery, selectedCompaniesFilter, selectedDiscipline, selectedCountries]);

  const uniqueDisciplines = useMemo(() => {
    const dSet = new Set<string>([
      "AI",
      "Digital",
      "Testing",
      "Computer Engineering",
      "Electronics Engineering",
      "Software Engineering",
      "Embedded Systems",
      "Physical Design",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Quality Assurance",
      "DevOps",
      "Cloud",
      "Data Science",
      "Machine Learning",
      "Hardware Engineering",
      "Systems Engineering",
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Architecture",
      "IT",
      "UI/UX Design",
      "Product Management",
      "Project Management",
      "Automation Machinery Manufacturing",
      "Engineering",
      "Software Development",
      "Appliance, Electrical, and Electronics Manufacturing",
      "Semiconductor Manufacturing",
      "Computer Hardware Manufacturing, Semiconductor Manufacturing, and Wireless Services",
      "Information Technology & Services",
      "Software Development and Engineering Services",
      "Computer Science & AI",
      "Motor Vehicle Parts Manufacturing",
      "Oil and gas",
      "Uncategorized"
    ]);

    (initialJobs || []).forEach(job => {
      let parsedTags: string[] = [];
      try {
        parsedTags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
      } catch {}
      parsedTags.forEach(t => {
        const lower = t.toLowerCase();
        // Ignore generic tags to only keep disciplines/majors
        if (!lower.includes('senior') && !lower.includes('junior') && !lower.includes('mid') &&
            !lower.includes('remote') && !lower.includes('hybrid') && !lower.includes('on-site') &&
            !lower.includes('full-time') && !lower.includes('part-time') && !lower.includes('contract') &&
            !lower.includes('internship') && !lower.includes('temporary') && !lower.includes('volunteer')) {
          dSet.add(t);
        }
      });
    });

    const targetEngineering = [
        "engineering", "software", "embedded", "devops", "cloud", "machine learning", 
        "data", "frontend", "backend", "full stack", "quality", "physical design"
    ];

    // Priority Order: AI, Digital, Testing, Computer, Electronics
    const priorityOrder = ["ai", "digital", "testing", "computer engineering", "electronics engineering"];

    return Array.from(dSet).sort((a, b) => {
      const aName = a.toLowerCase();
      const bName = b.toLowerCase();

      // Check explicit priority
      const aPriorityIdx = priorityOrder.indexOf(aName);
      const bPriorityIdx = priorityOrder.indexOf(bName);

      if (aPriorityIdx !== -1 && bPriorityIdx !== -1) return aPriorityIdx - bPriorityIdx;
      if (aPriorityIdx !== -1) return -1;
      if (bPriorityIdx !== -1) return 1;

      // Then check engineering
      const aIsEng = aName.includes('engineer') || targetEngineering.some(t => aName.includes(t));
      const bIsEng = bName.includes('engineer') || targetEngineering.some(t => bName.includes(t));
      
      if (aIsEng && !bIsEng) return -1;
      if (!aIsEng && bIsEng) return 1;

      // Fallback to alphabetical
      return aName.localeCompare(bName);
    });
  }, [initialJobs]);

  const uniqueCompanies = useMemo(() => {
    const targetOrder = [
      "Siemens", "Capgemini", "Cisco", "Siemens Energy", "STMicroelectronics", 
      "MediaTek", "Brightskies", "HCLTech", "Nawy", "Analog Devices", 
      "InfiniLink", "Valeo", "Siemens Gamesa", "ISS INTERNATIONAL SpA", 
      "Siemens Digital Industries Software", "Mixel-Egypt"
    ];

    const comps = new Set<string>();
    (initialJobs || []).forEach(j => {
      if (j.company) {
        comps.add(normalizeCompany(j.company));
      }
    });

    return Array.from(comps).sort((a, b) => {
      const aIdx = targetOrder.indexOf(a);
      const bIdx = targetOrder.indexOf(b);

      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [initialJobs]);

  
  const mainCompanyNames = useMemo(() => COMPANIES_META.map(c => c.name), []);
  const mainCompaniesList = useMemo(() => {
    return uniqueCompanies.filter(c => mainCompanyNames.includes(c) || COMPANIES_META.some(m => m.shortName === c));
  }, [uniqueCompanies, mainCompanyNames]);
  const otherCompaniesList = useMemo(() => {
    return uniqueCompanies.filter(c => !mainCompaniesList.includes(c));
  }, [uniqueCompanies, mainCompaniesList]);
  
  const filteredMainCompanies = useMemo(() => {
    const filtered = mainCompaniesList.filter(c => c.toLowerCase().includes(companySearchQuery.toLowerCase()));
    return filtered.sort((a, b) => {
      const aSelected = selectedCompaniesFilter.includes(a);
      const bSelected = selectedCompaniesFilter.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [mainCompaniesList, companySearchQuery, selectedCompaniesFilter]);
  const filteredOtherCompanies = useMemo(() => {
    const filtered = otherCompaniesList.filter(c => c.toLowerCase().includes(companySearchQuery.toLowerCase()));
    return filtered.sort((a, b) => {
      const aSelected = selectedCompaniesFilter.includes(a);
      const bSelected = selectedCompaniesFilter.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [otherCompaniesList, companySearchQuery, selectedCompaniesFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background font-main tracking-eyebrow pt-32 pb-12 px-4 sm:px-6 lg:px-12 relative flex flex-col transition-colors duration-200">
      
      {/* Background Glows matching Figma */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 dark:bg-cyan-900/20 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 flex flex-col flex-1 min-h-0 w-full">
        
        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200 dark:border-white/10 mb-8 overflow-x-auto custom-scrollbar shrink-0">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`pb-4 px-6 font-bold text-lg whitespace-nowrap transition-all border-b-2 ${activeTab === 'jobs' ? 'border-primary-500 text-primary-600 dark:border-[#70B5DF] dark:text-[#70B5DF]' : 'border-transparent text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}
          >
            Career Map
          </button>
          <button 
            onClick={() => setActiveTab('companies')}
            className={`pb-4 px-6 font-bold text-lg whitespace-nowrap transition-all border-b-2 ${activeTab === 'companies' ? 'border-primary-500 text-primary-600 dark:border-[#70B5DF] dark:text-[#70B5DF]' : 'border-transparent text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'}`}
          >
            Companies
          </button>
        </div>

        {activeTab === 'companies' ? (
          <CompaniesGrid onCompanyClick={setSelectedCompanyModal} />
        ) : (
          <>
            {/* Hero Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-wide uppercase">
                  Career Explorer
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base sm:text-lg">
                  Discover your next career move across the global semiconductor and tech landscape.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shrink-0 self-start sm:self-center shadow-xs">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{filteredJobs.length} Openings</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-white/90 dark:bg-neutral-600/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm relative z-50 shrink-0">
              {/* Select Countries Button */}
              <button 
                onClick={() => setIsMapModalOpen(true)}
                className="flex items-center gap-2 bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-neutral-200 text-sm rounded-xl py-3.5 px-5 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors shrink-0 whitespace-nowrap lg:max-w-[200px]"
              >
                <Map className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span className="truncate">Select Countries ({selectedCountries.length})</span>
              </button>

              {/* Search Input */}
              <FilterSearchInput
                placeholder="Search position, stack..."
                value={searchQuery}
                onChange={setSearchQuery}
              />

              {/* Source Dropdown */}
              <CustomSelect
                value={selectedSource}
                onChange={setSelectedSource}
                placeholder="All Sources"
                options={[
                  { label: 'LinkedIn', value: 'linkedin' },
                  { label: 'Wuzzuf', value: 'wuzzuf' }
                ]}
              />

              {/* Disciplines Dropdown */}
              <CustomSelect
                value={selectedDiscipline}
                onChange={setSelectedDiscipline}
                placeholder="All Disciplines"
                options={uniqueDisciplines.map(d => ({ label: d, value: d }))}
                searchable
              />

              {/* Reset All Filters Button */}
              <button
                type="button"
                onClick={handleResetAllFilters}
                title={hasActiveFilters ? "Reset all filters" : "No active filters"}
                aria-label="Reset all filters"
                className={`p-3 border rounded-xl transition-all flex items-center justify-center shrink-0 self-stretch sm:self-auto cursor-pointer ${
                  hasActiveFilters
                    ? "bg-rose-100 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 hover:text-rose-800 dark:hover:text-rose-200"
                    : "bg-neutral-100/75 dark:bg-neutral-800/50 border-neutral-200 dark:border-white/5 text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-white/10"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {serverError && (
              <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-400">Database Connection Error</h3>
                <p className="text-red-300 mt-2">{serverError}</p>
              </div>
            )}

            {/* Sidebar + Main Content Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0">
              
              {/* Left Sidebar - Brands/Companies Filter */}
              <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col gap-4 lg:sticky lg:top-28">
                <div className="bg-white/90 dark:bg-neutral-600/80 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-white/5 p-4 shadow-sm flex flex-col max-h-[600px]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-wide uppercase">Brand</h3>
                    <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  
                  {/* Search Companies */}
                  <div className="relative mb-3 shrink-0">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-neutral-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-primary-400 dark:focus:border-white/20 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      placeholder="Search"
                      value={companySearchQuery}
                      onChange={(e) => setCompanySearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Company Checkboxes */}
                  <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    {filteredMainCompanies.map(company => (
                      <label key={company} onClick={() => handleToggleCompany(company)} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-300 dark:border-white/10 group-hover:border-primary-400 dark:group-hover:border-white/30'}`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-neutral-900 font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate">{company}</span>
                      </label>
                    ))}

                    {showAllCompanies && filteredOtherCompanies.map(company => (
                      <label key={company} onClick={() => handleToggleCompany(company)} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-300 dark:border-white/10 group-hover:border-primary-400 dark:group-hover:border-white/30'}`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-neutral-900 font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors truncate">{company}</span>
                      </label>
                    ))}
                  </div>

                  {/* Show All Toggle */}
                  {(otherCompaniesList.length > 0 || (companySearchQuery && filteredOtherCompanies.length > 0)) && (
                    <button
                      onClick={() => setShowAllCompanies(!showAllCompanies)}
                      className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-[#70B5DF] dark:hover:text-[#5da0c9] transition-colors w-full text-left shrink-0"
                    >
                      {showAllCompanies ? "See Less" : "See All"}
                    </button>
                  )}
                </div>
              </aside>

              {/* Main Content - Jobs Grid */}
              <div className="flex-1 w-full pb-12">
                {filteredJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-700/50 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm">
                    <AlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4" />
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No jobs found</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">Try adjusting your filters or search query.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 relative z-10">
                    {filteredJobs.map((job: JobData) => {
                      let parsedTags: string[] = [];
                      try {
                        parsedTags = typeof job.tags_json === 'string' ? JSON.parse(job.tags_json) : (job.tags_json || []);
                      } catch {}

                      const seniority = parsedTags.find((t: string) => t.toLowerCase().includes('senior') || t.toLowerCase().includes('junior') || t.toLowerCase().includes('mid') || t.toLowerCase().includes('lead')) || 'Mid-Level';
                      const discipline = parsedTags.filter((t: string) => !t.toLowerCase().includes('senior') && !t.toLowerCase().includes('junior') && !t.toLowerCase().includes('mid') && !t.toLowerCase().includes('lead') && !t.toLowerCase().includes('remote') && !t.toLowerCase().includes('hybrid') && !t.toLowerCase().includes('on-site') && !t.toLowerCase().includes('full-time') && !t.toLowerCase().includes('part-time')).slice(0, 3).join(', ') || 'Engineering';
                      const locationLower = job.location?.toLowerCase() || '';
                      let locationShort = job.location || 'Remote';
                      if (locationLower.includes('egypt') || locationLower.includes('cairo')) locationShort = 'EG';
                      else if (locationLower.includes('saudi') || locationLower.includes('riyadh')) locationShort = 'SA';
                      else if (locationLower.includes('emirates') || locationLower.includes('dubai') || locationLower.includes('uae')) locationShort = 'UAE';
                      else {
                        const isUS = locationLower.includes('united states') || locationLower.includes(' usa') || locationLower.includes(', us') || locationLower === 'us' || locationLower === 'usa' || /(?:,\s*(?:al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy))(?:$|,\s*(?:us|usa|united states))/i.test(locationLower);
                        if (isUS) locationShort = 'US';
                      }


                      const seniorityLower = seniority.toLowerCase();
                      const isSeniorOrLead = seniorityLower.includes('senior') || seniorityLower.includes('lead') || seniorityLower.includes('principal');
                      const seniorityColor = isSeniorOrLead
                        ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/60 dark:border-purple-500/30 dark:text-purple-400'
                        : 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/60 dark:border-sky-500/30 dark:text-sky-400';

                      return (
                        <div 
                          key={job.id} 
                          onClick={() => setSelectedJob(job)}
                          className="bg-white dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200/80 dark:border-white/5 hover:border-primary-300 dark:hover:border-[#70B5DF] hover:[box-shadow:0px_0px_15px_rgba(112,181,223,0.3)] hover:bg-neutral-50/70 dark:hover:bg-neutral-600 transition-all duration-300 cursor-pointer rounded-2xl p-6 flex flex-col relative group shadow-sm hover:shadow-md dark:shadow-none"
                        >
                          {/* Top Row: Logo and EG Badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0 ${getCompanyColor(job.company || '')}`}>
                              {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                            </div>
                            
                            <div className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-bold tracking-wider">
                              {locationShort}
                            </div>
                          </div>

                          {/* Title and Company */}
                          <h3 className="text-neutral-900 dark:text-white font-bold text-[17px] leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6">
                            {job.company || 'Unknown Company'}
                          </p>

                          {/* Badges Section */}
                          <div className="mt-auto space-y-2.5">
                            {/* Row 1: Seniority and Employment Type */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${seniorityColor}`}>
                                <User className="w-3.5 h-3.5 shrink-0" />
                                <span>{seniority}</span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-500/30 dark:text-emerald-400 text-[11px] font-bold">
                                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                <span>{job.job_type || 'Full-time'}</span>
                              </div>
                            </div>

                            {/* Row 2: Discipline, Location, and Number Visited */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-950/50 dark:border-cyan-500/30 dark:text-cyan-400 text-[11px] font-bold max-w-[210px]">
                                <Code className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{discipline}</span>
                              </div>
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-500/30 dark:text-rose-400 text-[11px] font-bold">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span>{locationShort}</span>
                              </div>
                              <div 
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#70B5DF]/10 border border-[#70B5DF]/30 text-[#70B5DF] text-[11px] font-bold"
                                title="Number of people who clicked apply"
                              >
                                <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
                                <span>{visitCounts[String(job.id)] ?? job.number_visited ?? 0} visited</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <MapFilterModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedCountries={selectedCountries}
        onToggleCountry={handleToggleCountry}
        onConfirm={() => setIsMapModalOpen(false)}
        countryJobCounts={countryJobCounts}
      />
      
      <JobModal 
        job={selectedJob ? { ...selectedJob, number_visited: visitCounts[String(selectedJob.id)] ?? selectedJob.number_visited ?? 0 } : null} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        getCompanyColor={getCompanyColor}
        onApply={handleApplyClick}
      />
      
      <CompanyModal
        company={selectedCompanyModal}
        isOpen={!!selectedCompanyModal}
        onClose={() => setSelectedCompanyModal(null)}
        jobs={initialJobs}
        companyStats={companyStats}
      />
    
      {/* Mobile Floating Action Button (FAB) for Filters */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="bg-primary-600 dark:bg-[#70B5DF] text-white dark:text-neutral-900 p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Filter className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-neutral-800 rounded-t-3xl p-6 shadow-2xl flex flex-col transition-transform duration-300 ${isMobileDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Filters</h2>
            <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="bg-white/90 dark:bg-neutral-600/80 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-white/5 p-4 shadow-sm flex flex-col h-full max-h-[calc(100vh-100px)]">
                  <div className="flex items-center justify-between mb-3 shrink-0">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white tracking-wide uppercase">Brand</h3>
                    <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  
                  {/* Search Companies */}
                  <div className="relative mb-3 shrink-0">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      className="w-full bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-neutral-200 text-sm rounded-lg py-2 pl-9 pr-3 focus:outline-none focus:border-primary-400 dark:focus:border-white/20 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      placeholder="Search"
                      value={companySearchQuery}
                      onChange={(e) => setCompanySearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Company Checkboxes */}
                  <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                    {filteredMainCompanies.map(company => (
                      <label key={company} onClick={() => handleToggleCompany(company)} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-300 dark:border-white/10 group-hover:border-primary-400 dark:group-hover:border-white/30'}`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-neutral-900 font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate">{company}</span>
                      </label>
                    ))}

                    {showAllCompanies && filteredOtherCompanies.map(company => (
                      <label key={company} onClick={() => handleToggleCompany(company)} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedCompaniesFilter.includes(company) ? 'bg-[#70B5DF] border-[#70B5DF]' : 'bg-neutral-100 dark:bg-neutral-800/50 border-neutral-300 dark:border-white/10 group-hover:border-primary-400 dark:group-hover:border-white/30'}`}>
                          {selectedCompaniesFilter.includes(company) && <Check className="w-3.5 h-3.5 text-neutral-900 font-bold" />}
                        </div>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors truncate">{company}</span>
                      </label>
                    ))}
                  </div>

                  {/* Show All Toggle */}
                  {(otherCompaniesList.length > 0 || (companySearchQuery && filteredOtherCompanies.length > 0)) && (
                    <button
                      onClick={() => setShowAllCompanies(!showAllCompanies)}
                      className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-[#70B5DF] dark:hover:text-[#5da0c9] transition-colors w-full text-left shrink-0"
                    >
                      {showAllCompanies ? "See Less" : "See All"}
                    </button>
                  )}
                </div>
              
          </div>
        </div>
      </div>

</div>
  );
}
