"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import LogoIcon from "../Icons/Logo";
import ThemeIcon from "../Icons/Theme";
import { useTheme } from "@/src/hooks/useTheme";

export default function AuthShell({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-background text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(58,144,201,0.12)_0%,rgba(248,250,252,0)_38%),radial-gradient(circle_at_50%_82%,rgba(61,113,170,0.14)_0%,rgba(248,250,252,0)_42%)] dark:bg-[radial-gradient(circle_at_50%_18%,rgba(58,144,201,0.24)_0%,rgba(5,24,42,0)_38%),radial-gradient(circle_at_50%_82%,rgba(61,113,170,0.28)_0%,rgba(5,24,42,0)_42%),linear-gradient(180deg,#031525_0%,#05182a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0)_18%,rgba(0,0,0,0.04)_100%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_18%,rgba(0,0,0,0.18)_100%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <Link
            href="/"
            aria-label="NEXUS home"
            className="inline-flex items-center"
          >
            <LogoIcon className="h-8 w-auto" />
          </Link>

          <button
            aria-label="Toggle theme"
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-600 dark:text-neutral-200 transition-colors hover:text-neutral-900 dark:hover:text-neutral-50 cursor-pointer"
          >
            <ThemeIcon className="h-5 w-5" />
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
