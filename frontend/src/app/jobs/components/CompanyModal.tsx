"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X, Users, MapPin, Globe, Briefcase } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { CompanyMeta } from "@/src/data/companies";
import { matchCompanyId } from "@/src/data/companyMatcher";
import { JobData } from "./JobModal";
import type { CompanyMonthlyStat } from "@/src/lib/jobsDb";
import { useTheme } from "@/src/hooks/useTheme";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CompanyModalProps {
  company: CompanyMeta | null;
  isOpen: boolean;
  onClose: () => void;
  jobs: JobData[];
  companyStats?: CompanyMonthlyStat[];
}

export default function CompanyModal({ company, isOpen, onClose, jobs, companyStats = [] }: CompanyModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Clean company matching without 2-letter substring leaks
  const companyJobs = useMemo(() => {
    if (!company) return [];
    return jobs.filter((j) => matchCompanyId(j.company) === company.id);
  }, [jobs, company]);

  // 12-Month rolling timeline with explicit zeros for inactive months
  const chartData = useMemo(() => {
    if (!company) return [];

    const now = new Date();
    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      months.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
    }

    const statsMap = new Map<string, number>();
    for (const stat of companyStats) {
      if (stat.company_id === company.id) {
        statsMap.set(stat.year_month, stat.job_count);
      }
    }

    // Include current month active jobs from companyJobs if higher than database stats
    const currentYm = months[months.length - 1];
    let currentMonthCount = 0;
    for (const job of companyJobs) {
      if (job.first_seen_at) {
        const d = new Date(job.first_seen_at);
        const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
        if (ym === currentYm) {
          currentMonthCount++;
        }
      }
    }
    if (currentMonthCount > (statsMap.get(currentYm) || 0)) {
      statsMap.set(currentYm, currentMonthCount);
    }

    return months.map((date) => ({
      date,
      count: statsMap.get(date) || 0,
    }));
  }, [company, companyStats, companyJobs]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isOpen && !isVisible) return null;
  if (!company) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0 bg-neutral-900/40 dark:bg-neutral-900/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5 mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-sm shrink-0 ${company.color}`}>
              {company.shortName}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1 leading-tight">{company.name}</h2>
              <p className="text-neutral-600 dark:text-neutral-400">{company.industry}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Graph Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Hiring Timeline (Opened Positions)</h3>
              <div className="h-[200px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#2a3441" : "#e2e8f0"} vertical={false} />
                      <XAxis
  dataKey="date"
  stroke={isDark ? "#6b7280" : "#94a3b8"}
  fontSize={12}
  tickMargin={10}
  tickFormatter={(val: string) => {
    const parts = val.split('-');
    return parts.length === 2 ? `${parts[1]}/${parts[0].slice(2)}` : val;
  }}
/>
                      <YAxis stroke={isDark ? "#6b7280" : "#94a3b8"} fontSize={12} tickFormatter={(tick) => Math.floor(tick).toString()} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: isDark ? "#1a2336" : "#ffffff", borderColor: isDark ? "#2a3441" : "#e2e8f0", borderRadius: "8px", color: isDark ? "#fff" : "#0f172a" }}
                        itemStyle={{ color: "#70B5DF" }}
                      />
                      <Line type="monotone" dataKey="count" name="Jobs" stroke="#70B5DF" strokeWidth={2} dot={{ r: 4, fill: "#70B5DF", strokeWidth: 2, stroke: isDark ? "#151c2c" : "#ffffff" }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-neutral-200 dark:border-white/5 rounded-xl">
                    <p className="text-neutral-500 text-sm">No timeline data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Positions Section */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Latest Positions</h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {companyJobs.length > 0 ? (
                  companyJobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-xl p-3 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
                      <a href={job.url} target="_blank" rel="noreferrer" className="flex justify-between items-start group">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-[#70B5DF] transition-colors line-clamp-1">{job.title}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {job.first_seen_at ? new Date(job.first_seen_at).toISOString().split('T')[0] : "Recently"} • {job.job_type || "Full-time"}
                          </p>
                        </div>
                        <Briefcase className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-[#70B5DF] shrink-0 ml-2" />
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-sm italic">No active positions tracked recently.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-transparent rounded-xl p-5 mb-8">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">About</h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">{company.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Global Presence</h3>
            <div className="flex flex-wrap gap-2">
              {company.globalPresence.map((loc, i) => (
                <div key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-sm">
                  {loc}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors">
                <Globe className="w-5 h-5" />
                Website
              </a>
            )}
            {company.linkedin && (
              <a href={company.linkedin} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 bg-[#0a66c2] hover:bg-[#004182] text-white py-3 rounded-xl font-bold transition-colors">
                <FaLinkedin className="w-5 h-5" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
