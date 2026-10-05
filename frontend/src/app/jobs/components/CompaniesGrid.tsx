"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import FilterSearchInput from "./FilterSearchInput";
import MapFilterModal from "./MapFilterModal";
import { CompanyMeta, COMPANIES_META } from "@/src/data/companies";
import { Search, ChevronDown, MapPin, Briefcase, X, Check, RotateCcw, Map } from "lucide-react";

interface CompaniesGridProps {
  onCompanyClick: (company: CompanyMeta) => void;
}

function GridSelect({
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  alignRight = false,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  icon?: any;
  alignRight?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative shrink-0 min-w-[150px] lg:min-w-[180px]" ref={ref}>
      <div
        className={`w-full bg-neutral-100/75 dark:bg-neutral-800/50 border ${
          value ? "border-primary-400 bg-primary-50/50 dark:border-cyan-500/40 dark:bg-cyan-950/20" : "border-neutral-200 dark:border-white/5"
        } text-neutral-800 dark:text-neutral-300 text-sm rounded-xl py-3 ${
          Icon ? "pl-10" : "pl-4"
        } pr-10 cursor-pointer flex items-center justify-between transition-all hover:bg-neutral-200/50 dark:hover:bg-white/10 select-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && (
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none z-10">
            <Icon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </div>
        )}
        <span className={`truncate ${value ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-500 dark:text-neutral-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="absolute right-3.5 flex items-center gap-1.5">
          {value && (
            <span
              role="button"
              aria-label="Clear selection"
              className="p-0.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-neutral-500 dark:text-neutral-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 ${
            alignRight ? "right-0" : "left-0"
          } mt-2 min-w-[280px] sm:min-w-[340px] max-w-[420px] bg-white/95 dark:bg-neutral-600/[0.98] backdrop-blur-2xl border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-72 overflow-y-auto custom-scrollbar py-2`}
        >
          <div
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors select-none flex items-center justify-between ${
              value === ""
                ? "bg-primary-50 dark:bg-cyan-500/10 text-primary-600 dark:text-cyan-400 font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            <span>{placeholder} (All)</span>
            {value === "" && <Check className="w-4 h-4 text-primary-600 dark:text-cyan-400 shrink-0" />}
          </div>
          <div className="h-px bg-neutral-200 dark:bg-white/5 my-1" />
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors select-none flex items-center justify-between gap-3 ${
                value === opt.value
                  ? "bg-primary-50 dark:bg-cyan-500/10 text-primary-600 dark:text-cyan-400 font-semibold"
                  : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white"
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span className="truncate">{opt.label}</span>
              {value === opt.value && <Check className="w-4 h-4 text-primary-600 dark:text-cyan-400 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompaniesGrid({ onCompanyClick }: CompaniesGridProps) {
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const handleToggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const locationOptions = useMemo(() => {
    const locs = Array.from(new Set(COMPANIES_META.map((c) => c.hq))).sort();
    return locs.map((loc) => ({ label: loc, value: loc }));
  }, []);

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(COMPANIES_META.map((c) => c.industry))).sort();
    return cats.map((cat) => ({ label: cat, value: cat }));
  }, []);

  const sizeOptions = useMemo(() => {
    const sizes = Array.from(new Set(COMPANIES_META.map((c) => c.size))).sort();
    return sizes.map((size) => ({ label: size, value: size }));
  }, []);

  const hasActiveFilters = Boolean(search || selectedCountries.length > 0 || selectedCategory || selectedSize);

  const handleResetAllFilters = () => {
    setSearch("");
    setSelectedCountries([]);
    setSelectedCategory("");
    
  };

  const filteredCompanies = useMemo(() => {
    return COMPANIES_META.filter((c) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesSearch =
          c.name.toLowerCase().includes(query) ||
          c.industry.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.hq.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (selectedCountries.length > 0 && !selectedCountries.some(country => c.hq.toLowerCase().includes(country.toLowerCase()))) {
        return false;
      }

      if (selectedCategory && c.industry.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      if (selectedSize && c.size !== selectedSize) {
        return false;
      }

      return true;
    });
  }, [search, selectedCountries, selectedCategory, selectedSize]);

  return (
    <div className="w-full">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
            GLOBAL COMPANIES
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base sm:text-lg">
            Directory Of VLSI, Embedded Systems, And Tech Companies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shrink-0 self-start sm:self-center shadow-xs">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{filteredCompanies.length} Companies</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-8 bg-white/90 dark:bg-neutral-600/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm relative z-50">
        {/* Select Countries Button (Map Picker) */}
        <button
          onClick={() => setIsMapModalOpen(true)}
          className="flex items-center gap-2 bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-neutral-200 text-sm rounded-xl py-3.5 px-5 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-colors shrink-0 whitespace-nowrap lg:max-w-[200px]"
        >
          <Map className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
          <span className="truncate">Select Countries ({selectedCountries.length})</span>
        </button>

        {/* Search Input */}
        <FilterSearchInput
          placeholder="Search name or industry..."
          value={search}
          onChange={setSearch}
        />

        {/* Category Dropdown */}
        <GridSelect
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categoryOptions}
          placeholder="+ Add Category"
          alignRight={true}
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

      {/* 3 Columns on Desktop, 2 on Tablet, 1 on Mobile */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={() => onCompanyClick(company)}
          />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-neutral-700/50 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-sm">
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">No companies found matching your search or filters.</p>
        </div>
      )}

      <MapFilterModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedCountries={selectedCountries}
        onToggleCountry={handleToggleCountry}
        onConfirm={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}

