import Link from "next/link";
import LogoIcon from "./Icons/Logo";
import Button from "./ui/Button/Button";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="relative overflow-hidden">
        {/* Gradient overlay layer */}
        <div className="absolute inset-0 bg-linear-to-b from-[rgba(55,181,170,0.1)] to-[rgba(153,153,153,0)] backdrop-blur-xs" />

        {/* Footer content */}
        <div className="relative z-10 flex flex-col items-center gap-9 px-5.5 py-12.5">
          {/* Logo */}
          <Link
            href="/"
            aria-label="NEXUS home"
            className="flex items-center gap-2.5"
          >
            <LogoIcon />
          </Link>

          <div className="flex flex-col items-center gap-3">
            {/* Links */}
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <Button variant="link" intent="secondary" size="xl">
                        {link.label}
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Copyright */}
            <p className="font-[kanit] text-sm text-neutral-200">
              &copy; 2026 Scholar Nexus. Our Team.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
