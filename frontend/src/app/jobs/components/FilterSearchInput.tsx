"use client";

import React from "react";
import { Search } from "lucide-react";

interface FilterSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FilterSearchInput({
  placeholder,
  value,
  onChange,
}: FilterSearchInputProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
        <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
      </div>
      <input
        type="text"
        className="w-full bg-neutral-100/75 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/5 text-neutral-900 dark:text-neutral-200 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-primary-400 dark:focus:border-white/20 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
