import { ReactNode } from "react";
import { readPaperDesigns, readCardDesigns } from "../../lib/designs";

export default function NewLayout({ children }: { children: ReactNode }) {
  const papers = readPaperDesigns();
  const cards = readCardDesigns();
  const script = `window.__paperDesigns = ${JSON.stringify(papers)}; window.__cardDesigns = ${JSON.stringify(cards)};`;
  return (
    <>
      {children}
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}


