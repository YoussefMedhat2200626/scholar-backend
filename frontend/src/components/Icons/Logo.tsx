export default function Logo({
  className = "h-full w-full",
}: {
  className?: string;
}) {
  return (
    // <svg
    //   viewBox="0 0 32 32"
    //   aria-hidden="true"
    //   className={className}
    //   fill="none"
    //   stroke="currentColor"
    //   strokeWidth="2.8"
    // >
    //   <circle cx="16" cy="16" r="3.2" fill="currentColor" stroke="none" />
    //   <ellipse cx="16" cy="16" rx="13" ry="5.2" />
    //   <ellipse cx="16" cy="16" rx="13" ry="5.2" transform="rotate(60 16 16)" />
    //   <ellipse cx="16" cy="16" rx="13" ry="5.2" transform="rotate(120 16 16)" />
    // </svg>
    <img
    
    src="/logo.png"
    alt="logo"
    />
  );
}
