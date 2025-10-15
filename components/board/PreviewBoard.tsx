"use client";
import { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  cardType?: string | null;
  bannerText?: string; // 例: 田中さん 卒業おめでとうございます！
};

export default function PreviewBoard({ src, cardType, bannerText = "" }: Props) {
  // Hydration差異を避けるため、初期レンダーは bannerText のみを描画し、
  // マウント後に localStorage の値で更新する。
  // 初期レンダーは完全に静的（空）→ マウント後に値を同期
  const [mounted, setMounted] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [headline, setHeadline] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardSrc, setCardSrc] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRecipient(localStorage.getItem("okurun:recipient") || "");
      setHeadline(localStorage.getItem("okurun:headline") || "");
      setPhoto(localStorage.getItem("okurun:recipientPhoto"));
    }
  }, []);

  // cardTypeが変更されたときにカードのデザイン画像を取得
  useEffect(() => {
    if (cardType && mounted) {
      (async () => {
        try {
          const res = await fetch("/api/designs", { cache: "no-store" });
          const json = await res.json();
          const card = json.cards?.find((c: any) => c.id === cardType);
          if (card?.src) {
            setCardSrc(card.src);
          }
        } catch (e) {
          console.error("failed to load card design", e);
        }
      })();
    }
  }, [cardType, mounted]);

  const combined = mounted ? `${recipient ? `${recipient} ` : ""}${headline}`.trim() : "";
  return (
    <div className="relative mx-auto w-full max-w-[480px] aspect-[242/273]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="選択した色紙" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-neutral-100" />
      )}


      {/* 中央カードプレビュー */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-[360px] rounded-lg shadow-md border border-neutral-200 overflow-hidden">
          {/* カードデザインを背景に適用 */}
          {cardSrc ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cardSrc} alt="カードデザイン" className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    {mounted && photo ? (
                      <img src={photo} alt="" className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-white/80" />
                    )}
                    <div className="font-semibold text-[13px] text-white drop-shadow-lg" suppressHydrationWarning>
                      {recipient || "山田さん"}
                    </div>
                  </div>
                  <div className="text-[12px] leading-snug text-white drop-shadow-lg whitespace-pre-wrap" suppressHydrationWarning>
                    {headline || "今まで本当にありがとうございました！"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 p-4">
              <div className="flex items-center gap-3 mb-3">
                {mounted && photo ? (
                  <img src={photo} alt="" className="h-10 w-10 rounded-md object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-neutral-200" />
                )}
                <div className="font-semibold text-[13px] text-black" suppressHydrationWarning>
                  {recipient || "山田さん"}
                </div>
              </div>
              <div className="text-[12px] leading-snug text-black whitespace-pre-wrap" suppressHydrationWarning>
                {headline || "今まで本当にありがとうございました！"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


