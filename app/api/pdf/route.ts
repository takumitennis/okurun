import { NextRequest } from "next/server";

// 超簡易デモ: HTMLをPDFに変換した体で application/pdf を返す
// 実運用では serverless で Playwright/Puppeteer か外部API(CloudConvert等)を利用

export async function POST(req: NextRequest) {
  const { html } = await req.json().catch(() => ({ html: "<h1>OKURUN PDF</h1>" }));
  const content = `PDF DEMO\n--------------\nThis is a placeholder PDF.\nRender this HTML instead:\n${html?.slice(0, 200) || "(no html)"}`;
  // 簡易的に text/plain として返すが、フロント側で .pdf としてダウンロード可能
  return new Response(content, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=okurun.pdf",
    },
  });
}


