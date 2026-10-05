"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string | null;
  label: string;
}

export default function StatCounter({
  value,
  label,
}: Readonly<StatCounterProps>) {
  const numericValue = value && value !== "-" ? Number.parseFloat(value) : null;
  const suffix = value ? value.replace(/[\d.]/g, "") : "";

  const [display, setDisplay] = useState(
    numericValue === null ? (value ?? "-") : `0${suffix}`,
  );
  const rafRef = useRef<number>(null);

  useEffect(() => {
    if (numericValue === null) return;

    const duration = 3500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numericValue);
      setDisplay(`${current}${suffix}`);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [numericValue, suffix]);

  return (
    <div className="flex flex-col items-center gap-2.5 w-30 lg:w-33.25">
      <span className="font-[kanit] font-bold tracking-[0.05em] capitalize text-#FFFFFF text-[32px] leading-7.5 lg:text-[40px]">
        {display}
      </span>
      <span className="font-[kanit] font-medium tracking-[0.05em] capitalize text-neutral-100 text-[20px] leading-7.5 lg:text-[24px]">
        {label}
      </span>
    </div>
  );
}
