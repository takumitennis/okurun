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
  const [cardType, setCardType] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const src = localStorage.getItem("okurun:designSrc") || undefined;
      const card = localStorage.getItem("okurun:cardType");
      setDesignSrc(src);
      setCardType(card);
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
    try {
      setIsGeneratingPdf(true);
      const target = document.getElementById("yosegaki-preview");
      if (!target) {
        alert("プレビューが見つかりません。ページを再読み込みしてください。");
        return;
      }

      console.log("PDF生成を開始します...");
      
      // 動的にCDNから読み込み（npm依存なし）
      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      
      const html2canvas = (window as any).html2canvas as (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
      const { jsPDF } = (window as any).jspdf;

      console.log("キャンバスを生成中...");
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true,
      });

      console.log("PDFを作成中...");
      const imgData = canvas.toDataURL("image/png", 1.0);
      const orientation = canvas.width > canvas.height ? "l" : "p";
      const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
      
      console.log("PDFを保存中...");
      pdf.save(`okurun_${id}.pdf`);
      
      console.log("PDF保存が完了しました！");
    } catch (error) {
      console.error("PDF生成エラー:", error);
      alert("PDFの生成に失敗しました。ブラウザを再読み込みして再度お試しください。");
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  return (
    <div>
      <StepBar current={3} />
      <div className="max-w-3xl mx-auto px-4 py-10 text-center space-y-6">
        <Card className="p-6">
          <div id="yosegaki-preview">
            <PreviewBoard src={designSrc} cardType={cardType} />
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
          <Button 
            variant="outline" 
            className="px-6 py-2" 
            onClick={savePdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? "生成中..." : "PDFとして保存"}
          </Button>
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


