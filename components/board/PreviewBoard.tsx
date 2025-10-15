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

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRecipient(localStorage.getItem("okurun:recipient") || "");
      setHeadline(localStorage.getItem("okurun:headline") || "");
      setPhoto(localStorage.getItem("okurun:recipientPhoto"));
    }
  }, []);

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
      <div className="absolute left-3 right-3 top-3 bg-white/90 rounded-md shadow-sm border border-neutral-200 px-3 py-2 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {mounted && photo ? <img src={photo} alt="" className="rounded-full h-8 w-8 object-cover" /> : <div className="h-8 w-8 rounded-full bg-neutral-300" />}
        <div className="text-[11px] font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis" suppressHydrationWarning>
          {combined}
        </div>
      </div>

      {/* 中央カードプレビュー */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-[360px] bg-white/95 rounded-lg shadow-md border border-neutral-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            {mounted && photo ? (
              <img src={photo} alt="" className="h-10 w-10 rounded-md object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-md bg-neutral-200" />
            )}
            <div className="font-semibold text-[13px]" suppressHydrationWarning>
              {recipient || "山田さん"}
            </div>
          </div>
          <div className="text-[12px] leading-snug text-neutral-700 whitespace-pre-wrap" suppressHydrationWarning>
            {headline || "今まで本当にありがとうございました！"}
          </div>
        </div>
      </div>
    </div>
  );
}


