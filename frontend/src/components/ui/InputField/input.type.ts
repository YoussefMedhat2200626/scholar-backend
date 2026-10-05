export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success" | "disabled";
export type InputWidth = "sm" | "md" | "lg" | "full" | "fit";
export type InputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "size"
> & {
  label?: string;
  error?: string;
  success?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  containerClassName?: string;
  size?: InputSize;
  width?: InputWidth;
};