import { LightingGlowVariant } from "./lightingGlow.type";

const getLightingGlowClasses = (variant: LightingGlowVariant) => {
  const base = "absolute inset-0 rounded-full";

  const variants: Record<LightingGlowVariant, string> = {
    primary: "bg-primary-300", // pick the shade you want
    accent: "bg-accent-400", // matches hero right glow #37B5AA
  };

  return `${base} ${variants[variant]}`;
};

export default getLightingGlowClasses;
