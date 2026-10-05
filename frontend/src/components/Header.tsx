"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LogoIcon from "./Icons/Logo";
import ThemeIcon from "./Icons/Theme";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button/Button";
import { User } from "./Icons/User";
import { useTheme } from "@/src/hooks/useTheme";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
];

function MenuIcon({ className }: { className?: string }) {
  return <Menu className={className} />;
}

function CloseIcon({ className }: { className?: string }) {
  return <X className={className} />;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 z-50 flex min-h-21.5 w-full flex-col bg-white/80 dark:bg-neutral-900/50 border-b border-neutral-200/60 dark:border-white/5 px-6 py-6 backdrop-blur-[7.5px] sm:px-10 lg:h-21.5 lg:flex-row lg:items-center lg:justify-between lg:px-26 lg:py-3.5 overflow-hidden transition-colors duration-200">
      <div className="flex w-full items-center justify-between lg:w-max">
        <Link
          aria-label="NEXUS home"
          className="flex h-12.5 shrink-0 items-center gap-2.5 text-primary-300"
          href="/"
          onClick={() => setIsMenuOpen(false)}
        >
          <LogoIcon className="h-8 w-8" />
        </Link>

        {/* Mobile controls (Theme + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label="Toggle theme"
            className="flex h-12.5 w-12.5 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            type="button"
            onClick={toggleTheme}
          >
            <ThemeIcon className="h-8 w-8" />
          </button>
          <button
            aria-label="Toggle menu"
            className="flex h-12.5 w-12.5 items-center justify-center rounded-xl text-neutral-600 dark:text-neutral-300 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-8 w-8" />
            ) : (
              <MenuIcon className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>
      {/* Navigation and Actions */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } mt-4 flex-col gap-4 lg:mt-0 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-2.5 lg:flex-1 lg:pl-10`}
      >
        <nav
          aria-label="Primary navigation"
          className="flex w-full flex-col lg:w-auto lg:flex-row lg:items-center lg:mx-auto"
        >
          <ul className="flex flex-col gap-2 lg:flex-row lg:gap-6.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const navLinkClassName =
                `relative isolate flex h-12.5 items-center justify-start lg:justify-center overflow-visible rounded-xl px-4 lg:px-2.5 font-main tracking-display capitalize transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 ${
                  isActive
                    ? "text-h3-sm text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800/50 lg:bg-transparent"
                    : "text-btn text-neutral-600 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/30 lg:hover:bg-transparent"
                }`.trim();

              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={navLinkClassName}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden h-8 w-15.75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400 blur-[50px] lg:block"
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop actions and mobile login */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-2.5 lg:w-45 lg:justify-end border-t border-neutral-200 dark:border-neutral-800 pt-4 lg:border-t-0 lg:pt-0">
          <button
            aria-label="User profile"
            className="flex h-13.5 w-13.5 items-center justify-center rounded-xl px-2 py-1 text-neutral-600 dark:text-neutral-300 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              router.push("/login");
            }}
          >
            <User className="h-8 w-8" />
          </button>
          <button
            aria-label="Toggle theme"
            className="hidden lg:flex h-13.5 w-13.5 items-center justify-center rounded-xl px-2 py-1 text-neutral-600 dark:text-neutral-300 transition-colors duration-200 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
            type="button"
            onClick={toggleTheme}
          >
            <ThemeIcon className="h-9.5 w-9.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
