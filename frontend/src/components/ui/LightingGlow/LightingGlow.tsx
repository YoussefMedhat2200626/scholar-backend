import getLightingGlowClasses from "./lightingGlow.style";

interface LightingGlowProps {
  variant: "accent" | "primary";
  className?: string;
}

const LightingGlow = ({
  variant = "primary",
  className = "",
}: LightingGlowProps) => {
  return (
    <div
      className={`${getLightingGlowClasses(variant)} ${className}`}
      aria-hidden
    />
  );
};
export default LightingGlow;
