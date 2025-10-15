import { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  intent?: "default" | "accent";
  appearance?: "badge" | "tag"; // tag = #ハッシュスタイル
};

export default function Chip({ className = "", intent = "default", appearance = "badge", ...rest }: Props) {
  if (appearance === "tag") {
    const tagBase =
      "inline-flex items-center text-xs font-medium tracking-wide text-neutral-600 before:content-['#'] before:mr-0.5 select-none";
    return <span className={`${tagBase} ${className}`} {...rest} />;
  }

  const base = "inline-flex items-center rounded-2xl px-3 py-1 text-xs font-medium border";
  const styles: Record<string, string> = {
    default: "bg-white text-neutral-800 border-neutral-300",
    accent: "bg-accent/10 text-accent border-accent/30",
  };
  return <span className={`${base} ${styles[intent]} ${className}`} {...rest} />;
}


