"use client";

import { use, useEffect, useState } from "react";
import StepBar from "../../../components/wizard/StepBar";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Link from "next/link";
import PreviewBoard from "../../../components/board/PreviewBoard";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const url = `https://okurun.jp/b/${id}`;
  const [designSrc, setDesignSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const src = localStorage.getItem("okurun:designSrc") || undefined;
      setDesignSrc(src);
    }
  }, []);

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`failed to load ${src}`));
      document.body.appendChild(s);
    });

  const savePdf = async () => {
    const target = document.getElementById("yosegaki-preview");
    if (!target) return;
    // 動的にCDNから読み込み（npm依存なし）
    await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    const html2canvas = (window as any).html2canvas as (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    const { jsPDF } = (window as any).jspdf;

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
    const imgData = canvas.toDataURL("image/png", 1.0);
    const orientation = canvas.width > canvas.height ? "l" : "p";
    const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
    pdf.save(`okurun_${id}.pdf`);
  };
  return (
    <div>
      <StepBar current={3} />
      <div className="max-w-3xl mx-auto px-4 py-10 text-center space-y-6">
        <Card className="p-6">
          <div id="yosegaki-preview">
            <PreviewBoard src={designSrc} cardType={"simple"} />
          </div>
          <div className="mt-2 text-sm text-neutral-600">デザインプレビュー（ダミー）</div>
        </Card>

        <div className="rounded-2xl border border-neutral-200 p-4 select-all">
          <div className="text-neutral-600 text-sm mb-1">URL</div>
          <div className="font-mono text-neutral-800 break-all">{url}</div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href={`/b/${id}`}>
            <Button className="px-6 py-2">入力する</Button>
          </Link>
          <Button variant="outline" className="px-6 py-2" onClick={savePdf}>PDFとして保存</Button>
          <a
            className="px-3 py-2 rounded-2xl border border-accent text-accent hover:bg-accent/10"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("寄せ書きを書いてね！")}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <a
            className="px-3 py-2 rounded-2xl border border-accent text-accent hover:bg-accent/10"
            href={`https://line.me/R/msg/text/?${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
          >
            LINE
          </a>
        </div>
      </div>
    </div>
  );
}


