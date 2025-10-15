"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import BoardPreview from "../../../components/board/BoardPreview";

const MESSAGE_MAX = 200;

export default function BoardInputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string>("simple");
  const [submitted, setSubmitted] = useState(false);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [isPublicPreview, setIsPublicPreview] = useState(false);
  const [designSrc, setDesignSrc] = useState<string | undefined>(undefined);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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
      
      // 画像の読み込みを待つ
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // すべての画像が読み込まれるまで待機
      const images = target.querySelectorAll('img');
      console.log(`Found ${images.length} images to wait for`);
      
      await Promise.all(Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // エラーでも続行
          }
        });
      }));
      
      console.log("All images loaded, proceeding with PDF generation");
      
      // 動的にCDNから読み込み
      await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
      
      const html2canvas = (window as any).html2canvas as (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
      const { jsPDF } = (window as any).jspdf;

      console.log("キャンバスを生成中...");
      
      // 色紙サイズに合わせてスケール計算
      const targetWidth = 914; // 242mm in pixels at 96dpi
      const targetHeight = 1032; // 273mm in pixels at 96dpi
      
      const targetAspectRatio = targetWidth / targetHeight;
      const currentAspectRatio = target.offsetWidth / target.offsetHeight;
      
      let scale;
      if (currentAspectRatio > targetAspectRatio) {
        scale = targetHeight / target.offsetHeight;
      } else {
        scale = targetWidth / target.offsetWidth;
      }
      
      scale = Math.min(scale, 5);
      
      const canvas = await html2canvas(target, {
        scale: scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 30000,
        removeContainer: false,
        width: target.offsetWidth,
        height: target.offsetHeight,
        scrollX: 0,
        scrollY: 0
      });
      
      console.log("Canvas created:", {
        width: canvas.width,
        height: canvas.height
      });

      console.log("PDFを作成中...");
      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // 色紙サイズ（24.2cm × 27.3cm）でPDFを作成
      const shikishiWidth = 242; // mm
      const shikishiHeight = 273; // mm
      
      const pdf = new jsPDF({ 
        orientation: "portrait", 
        unit: "mm", 
        format: [shikishiWidth, shikishiHeight] 
      });
      
      // キャンバスのアスペクト比を計算
      const canvasAspectRatio = canvas.width / canvas.height;
      const shikishiAspectRatio = shikishiWidth / shikishiHeight;
      
      let imgWidth, imgHeight, x, y;
      
      if (canvasAspectRatio > shikishiAspectRatio) {
        imgWidth = shikishiWidth;
        imgHeight = shikishiWidth / canvasAspectRatio;
        x = 0;
        y = (shikishiHeight - imgHeight) / 2;
      } else {
        imgHeight = shikishiHeight;
        imgWidth = shikishiHeight * canvasAspectRatio;
        x = (shikishiWidth - imgWidth) / 2;
        y = 0;
      }
      
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "MEDIUM");
      
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCardType(localStorage.getItem("okurun:cardType") || "simple");
      // プレビュー公開設定を取得（デフォルトはfalse）
      setIsPublicPreview(localStorage.getItem("okurun:isPublicPreview") === "true");
      // 色紙デザインを取得
      const src = localStorage.getItem("okurun:designSrc");
      if (src) setDesignSrc(src);
    }
  }, []);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const overLimit = message.length > MESSAGE_MAX;

  const submit = async () => {
    if (overLimit || !name || !message) return;
    
    try {
      const messageData = {
        boardId: id,
        name,
        message,
        photo,
      };

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("メッセージ投稿成功:", result);
        setSubmitted(true);
        
        // プレビュー公開設定が有効な場合は、全メッセージを取得
        if (isPublicPreview) {
          try {
            const messagesResponse = await fetch(`/api/messages?boardId=${id}`);
            const messagesResult = await messagesResponse.json();
            if (messagesResult.success) {
              setAllMessages(messagesResult.messages);
            }
          } catch (error) {
            console.error("メッセージ取得エラー:", error);
          }
        }
        
        setName("");
        setMessage("");
        setPhoto(null);
      } else {
        console.error("メッセージ投稿失敗:", result.error);
        alert("メッセージの投稿に失敗しました。再度お試しください。");
      }
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      alert("エラーが発生しました。再度お試しください。");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">寄せ書きに入力する</h1>

      {!submitted ? (
        <>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-neutral-700 mb-1">あなたの名前</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-700 mb-1">メッセージ（最大200文字）</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  maxLength={MESSAGE_MAX + 1}
                  className={`w-full rounded-xl border px-3 py-2 focus-visible:outline focus-visible:outline-2 ${
                    overLimit ? "border-red-400 focus-visible:outline-red-500" : "border-neutral-300 focus-visible:outline-brand"
                  }`}
                  required
                />
                <div className={`text-xs text-right ${overLimit ? "text-red-600" : "text-neutral-500"}`}>
                  {Math.min(message.length, MESSAGE_MAX)}/{MESSAGE_MAX}
                </div>
              </div>
              <div>
                <label className="block text-sm text-neutral-700 mb-1">写真（任意）</label>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={onFile}
                    className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-dark"
                  />
                  {photo && (
                    <div className="text-xs text-green-600">✓ 写真が選択されました</div>
                  )}
                </div>
              </div>
              <Button type="submit" className="px-6 py-2" disabled={overLimit || !name || !message}>
                完了する
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-sm text-neutral-600">寄せ書きプレビュー</div>
              <Card className="p-4">
                <div className="flex justify-center">
                  <div className="transform scale-75">
                    <BoardPreview 
                      messages={name && message ? [{
                        id: "preview",
                        name: name,
                        message: message,
                        photo: photo
                      }] : []} 
                      designSrc={designSrc} 
                      cardSrc={cardType}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-sm text-neutral-500">ボードID: {id}</div>
        </>
      ) : (
        <div className="space-y-6">
          {/* お礼メッセージ */}
          <Card className="p-6 space-y-3">
            <div className="text-lg font-semibold">ご入力ありがとうございました！</div>
            <div className="text-sm text-neutral-600">あなたのメッセージは寄せ書きに反映されました。</div>
            <div className="flex gap-2">
              <Link href={`/share/${id}`}><Button variant="outline">共有ページへ戻る</Button></Link>
              {typeof window !== "undefined" && localStorage.getItem("okurun:isAdmin") === "true" && (
                <Link href="/me"><Button>管理画面へ</Button></Link>
              )}
            </div>
          </Card>

          {/* プレビュー公開設定が有効な場合のみ、寄せ書きプレビューを表示 */}
          {isPublicPreview && (
            <Card className="p-6 space-y-4">
              <div className="text-lg font-semibold">みんなの寄せ書き（{allMessages.length}件のメッセージ）</div>
              <div className="flex justify-center">
                <BoardPreview 
                  messages={allMessages} 
                  designSrc={designSrc} 
                  cardSrc={cardType}
                />
              </div>
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={savePdf}
                  disabled={isGeneratingPdf}
                  variant="primary"
                >
                  {isGeneratingPdf ? "生成中..." : "PDFとして保存"}
                </Button>
              </div>
              <div className="text-sm text-neutral-600 text-center">
                実際の寄せ書きをPDFとして保存できます
              </div>
            </Card>
          )}

          {/* プレビュー公開設定が無効な場合の説明 */}
          {!isPublicPreview && (
            <Card className="p-6 space-y-3 bg-blue-50 border-blue-200">
              <div className="text-sm text-blue-800">
                💡 管理者が「全員にプレビューを公開する」にチェックを入れると、みんなのメッセージが見えるようになります。
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}


