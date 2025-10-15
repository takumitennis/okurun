import { ReactNode } from "react";
import Script from "next/script";
import { readPaperDesigns, readCardDesigns } from "../../lib/designs";

export default function NewLayout({ children }: { children: ReactNode }) {
  const papers = readPaperDesigns();
  const cards = readCardDesigns();
  const script = `window.__paperDesigns = ${JSON.stringify(
    papers
  )}; window.__cardDesigns = ${JSON.stringify(cards)};`;
  return (
    <>
      {/* Ensure the data is available before any client component hydrates */}
      <Script id="okurun-initial-data" strategy="beforeInteractive">
        {script}
      </Script>
      {children}
    </>
  );
}


