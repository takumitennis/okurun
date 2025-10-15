import { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
};

export default function Card({
  children,
  className = "",
  hoverable = true,
  ...rest
}: Props) {
  const base = "rounded-2xl bg-white border border-neutral-200 shadow-sm";
  const hover = hoverable ? "transition-shadow hover:shadow-lg" : "";
  return (
    <div className={`${base} ${hover} ${className}`} {...rest}>
      {children}
    </div>
  );
}


