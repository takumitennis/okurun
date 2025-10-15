import { ReactNode } from "react";
import { readPaperDesigns, readCardDesigns } from "../../lib/designs";

export default function NewLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}


