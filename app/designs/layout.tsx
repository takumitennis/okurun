import { ReactNode } from "react";
import fs from "fs";
import { readPaperDesigns, readCardDesigns } from "../../lib/designs";

export default function DesignsLayout({ children }: { children: ReactNode }) {
  // クライアントへ初期データを埋め込む（簡易）
  const paper = readPaperDesigns();
  const cards = readCardDesigns();
  const script = `window.__paperDesigns = ${JSON.stringify(
    paper.map((p) => ({ ...p, label: p.category }))
  )}; window.__cardDesigns = ${JSON.stringify(cards.map((c) => ({ ...c, label: "カード" })))};`;

  return (
    <>
      {children}
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}


