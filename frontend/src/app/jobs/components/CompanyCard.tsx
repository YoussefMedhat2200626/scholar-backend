"use client";

import React from "react";
import { Users, MapPin, Lock } from "lucide-react";
import { CompanyMeta } from "@/src/data/companies";

interface CompanyCardProps {
  company: CompanyMeta;
  onClick: () => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-700/80 backdrop-blur-sm border border-neutral-200/80 dark:border-white/5 hover:border-primary-300 dark:hover:border-primary-300 hover:bg-neutral-50/70 dark:hover:bg-neutral-600 transition-all duration-300 cursor-pointer rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md dark:shadow-none hover:[box-shadow:0px_0px_15px_rgba(112,181,223,0.3)] h-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0 ${company.color}`}>
          {company.shortName}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold tracking-wider uppercase text-right max-w-[220px] truncate">
            {company.industry}
          </div>
          
        </div>
      </div>

      <h3 className="text-neutral-900 dark:text-white font-bold text-[17px] leading-snug mb-2 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
        {company.name}
      </h3>
      
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
        {company.description}
      </p>

      <div className="mt-auto space-y-3.5">
        <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>HQ: {company.hq}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {company.globalPresence.slice(0, 3).map((loc, i) => (
            <div key={i} className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs">
              {loc}
            </div>
          ))}
          {company.globalPresence.length > 3 && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs">
              +{company.globalPresence.length - 3}
            </div>
          )}
        </div>

        {company.note && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold pt-1">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{company.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}

