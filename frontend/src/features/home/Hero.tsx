import Button from "@/src/components/ui/Button/Button";
import LightingGlow from "@/src/components/ui/LightingGlow/LightingGlow";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-900 w-full min-h-[calc(10svh-5.375rem)] py-25 lg:min-h-0 lg:pt-0 lg:pb-20">
      {/* Desktop SVG waves - hidden on mobile/tablet */}
      <div className="hidden lg:block relative w-full aspect-1619/634 overflow-hidden">
        <svg
          viewBox="0 0 1619 634"
          fill="none"
          preserveAspectRatio="xMidYMax meet"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1617.46 128.878C1516.36 158.093 1452.13 197.711 1444.2 301.263C1436.64 406.239 1305.61 468.16 1195.26 456.095C1084.38 444.442 1097.04 541.996 1030.71 588.714C984.866 621.004 961.401 617.652 853.473 627.539"
            stroke="#37B5AA"
            strokeWidth="8"
          />
          <path
            d="M1496.01 4.53741C1386.05 -6.10173 1274.37 113.912 1266.43 217.463C1258.88 322.44 1199.92 368.896 1089.57 356.831C978.701 345.178 911.395 395.416 904.362 499.98C886.302 564.586 831.938 615.73 724.011 625.616"
            stroke="#1D5C87"
            strokeWidth="8"
          />
          <path
            d="M1176.02 626.001C1259.93 617.928 1334.84 601.784 1392.14 526.825C1449.45 451.867 1503.28 423.325 1615.43 423.325"
            stroke="#B9F1EC"
            strokeWidth="8"
          />
          <path
            d="M1179.73 625.938L0.0134132 629.915"
            stroke="url(#paint0_linear_35_10)"
            strokeWidth="8"
          />
          <defs>
            <linearGradient
              id="paint0_linear_35_10"
              x1="0.013376"
              y1="627.926"
              x2="1179.73"
              y2="627.926"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1F645E" />
              <stop offset="1" stopColor="#B9F1EC" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute bottom-[20%] right-[15%] w-71.5 h-50">
            <LightingGlow variant="primary" className="blur-[150px]" />
          </div>
          <div className="absolute bottom-[35%] right-[8%] w-73.5 h-54">
            <LightingGlow variant="accent" className="blur-[150px]" />
          </div>
        </div>
      </div>

      {/* Mobile glows - hidden on desktop */}
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[30%] left-[-4%] w-34 h-16.25">
          <LightingGlow variant="primary" className="blur-[85px]" />
        </div>
        <div className="absolute top-[40%] right-[-3%] w-36.75 h-16.75">
          <LightingGlow variant="accent" className="blur-[85px]" />
        </div>
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-6 lg:absolute lg:inset-0 lg:flex lg:items-start lg:pt-41.25">
        <div className="flex flex-col gap-6 lg:gap-5.75 max-w-191.25">
          <p className="font-secondary font-normal capitalize text-accent-400 text-eyebrow tracking-eyebrow lg:text-[24px]">
            Scholar Nexus
          </p>

          <h1 className="font-main font-bold capitalize text-neutral-50 text-h1-sm tracking-display w-full lg:text-h1 lg:max-w-127">
            Join To Connect And Advance Research
          </h1>

          <p className="font-secondary font-normal text-neutral-100 text-subtext leading-loose tracking-[5%] w-full lg:text-[20px]">
            Bringing Academia And Industry Together. Connect, Explore Projects,
            And Unlock Opportunities.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-9">
            <Button
              intent="primary"
              variant="solid"
              size="lg"
              className="w-full sm:w-auto lg:text-xl lg:py-2.5 lg:px-6"
            >
              Get Started
            </Button>
            <Button
              intent="primary"
              variant="outlined"
              size="lg"
              className="w-full sm:w-auto lg:text-xl lg:py-2.5 lg:px-6"
            >
              Join Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
