// input.styles.ts
import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "peer w-full rounded-2xl border-2 bg-transparent text-neutral-50 outline-none",
  {
    variants: {
      variant: {
        default:
          "border-primary-400 focus:border-primary-300 focus:shadow-[0_2px_20px_0_#70B5DF33]",

        error:
          "border-danger-300 focus:border-danger-300 shadow-[0_2px_20px_0_#FC2D1D33]",

        success:
          "border-accent-400 focus:border-accent-400 shadow-[0_2px_20px_0_#05182A33]",

        disabled:
          "border-neutral-400 text-neutral-400 cursor-not-allowed opacity-60",
      },

      width: {
        sm: "w-48",
        md: "w-72",
        lg: "w-96",
        full: "w-full",
        fit: "w-fit",
      },

      size: {
        sm: "text-sm px-4 py-2",
        md: "text-base px-5 py-2",
        lg: "text-lg px-6 py-3",
      },

      hasLabel: {
        true: "pt-7 pb-3",
        false: "",
      },

      hasRightIcon: {
        true: "pr-12",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
      width: "full",
      hasLabel: true,
      hasRightIcon: false,
    },
  },
);

export const labelVariants = cva(
  "absolute left-5 top-2 py-1 text-lg leading-5 tracking-wider font-medium capitalize",
  {
    variants: {
      variant: {
        default: "text-primary-400 peer-focus:text-primary-300",
        error: "text-danger-300 peer-focus:text-danger-300",
        success: "text-accent-400 peer-focus:text-accent-400",
        disabled: "text-neutral-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const iconVariants = cva("absolute right-4 top-1/2 -translate-y-1/2", {
  variants: {
    variant: {
      default: "text-primary-400",
      error: "text-danger-300",
      success: "text-accent-400",
      disabled: "text-neutral-400 cursor-not-allowed",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});