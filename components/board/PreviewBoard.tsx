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

      {/* 上部バナー（送り先の写真＋一言） */}
      <div className="absolute left-3 right-3 top-3 px-3 py-2 flex items-center justify-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {mounted && photo ? <img src={photo} alt="" className="rounded-full h-8 w-8 object-cover" /> : <div className="h-8 w-8 rounded-full bg-neutral-300" />}
        <div className="text-[11px] font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis text-black" suppressHydrationWarning>
          {combined}
        </div>
      </div>

      {/* メッセージカード群（20カード分のグリッド） */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-2 p-4 pt-16">
        {Array.from({ length: 20 }).map((_, i) => {
          // カードデザインを背景に適用
          const cardStyle = cardSrc ? {
            backgroundImage: `url(${cardSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {};
          
          return (
            <div 
              key={i} 
              className="rounded-md shadow-sm border border-neutral-200 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={cardStyle}
            >
              {/* カードデザインがある場合は薄いオーバーレイを追加 */}
              {cardSrc && <div className="absolute inset-0 bg-white/80" />}
              
              <div className="relative z-10">
                {i === 0 ? (
                  // 最初のカードは受取人情報
                  <>
                    {mounted && photo ? (
                      <img src={photo} alt="" className="h-6 w-6 rounded-full object-cover mb-1" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-neutral-200 mb-1" />
                    )}
                    <div className="text-[9px] font-semibold text-black leading-tight" suppressHydrationWarning>
                      {recipient || "山田さん"}
                    </div>
                    <div className="text-[8px] text-black leading-tight" suppressHydrationWarning>
                      {headline || "今まで本当にありがとうございました！"}
                    </div>
                  </>
                ) : i === 1 ? (
                  // 2番目のカードはサンプルメッセージ
                  <>
                    <div className="h-6 w-6 rounded-full bg-accent/20 mb-1 flex items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-accent" />
                    </div>
                    <div className="text-[9px] font-semibold text-black leading-tight">
                      田中さん
                    </div>
                    <div className="text-[8px] text-black leading-tight">
                      お疲れ様でした！
                    </div>
                  </>
                ) : (
                  // その他のカードは空のプレースホルダー
                  <>
                    <div className="h-6 w-6 rounded-full bg-neutral-200 mb-1" />
                    <div className="h-2 w-full bg-neutral-200 rounded mb-1" />
                    <div className="h-1.5 w-3/4 bg-neutral-200 rounded" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


