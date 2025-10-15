import { ButtonHTMLAttributes } from "react";

type Variant =
  | "brand"
  | "accent"
  | "neutral"
  | "outline"
  | "ghost"
  // backward compatibility
  | "primary"
  | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  className = "",
  variant = "brand",
  ...props
}: Props) {
  const v = variant === "primary" ? "brand" : variant === "secondary" ? "accent" : variant;
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-medium transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";
  const styles: Record<string, string> = {
    brand: "bg-brand text-white hover:bg-brand-dark",
    accent: "border border-accent text-accent hover:bg-accent/10",
    neutral: "bg-neutral-200 text-neutral-700",
    outline: "bg-white text-brand border border-brand hover:bg-brand/10",
    ghost: "text-neutral-800 hover:bg-neutral-100",
    primary: "", // not used after mapping
    secondary: "",
  } as const;

  return <button className={`${base} ${styles[v]} ${className}`} {...props} />;
}


