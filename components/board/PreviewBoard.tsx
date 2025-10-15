"use client";

type Props = {
  src?: string | null;
  cardType?: string | null;
  bannerText?: string; // 例: 田中さん 卒業おめでとうございます！
};

export default function PreviewBoard({ src, cardType, bannerText = "田中さん 卒業おめでとうございます！" }: Props) {
  // Hydration差異を避けるため、初期レンダーは bannerText のみを描画し、
  // マウント後に localStorage の値で更新する。
  const recipient = typeof window !== "undefined" ? localStorage.getItem("okurun:recipient") || "" : "";
  const headline = typeof window !== "undefined" ? localStorage.getItem("okurun:headline") || bannerText : bannerText;
  const photo = typeof window !== "undefined" ? localStorage.getItem("okurun:recipientPhoto") : null;
  const combined = `${recipient ? `${recipient} ` : ""}${headline || ""}`.trim() || bannerText;
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
        {photo ? <img src={photo} alt="recipient" className="rounded-full h-8 w-8 object-cover" /> : <div className="h-8 w-8 rounded-full bg-neutral-300" />}
        <div className="text-[11px] font-semibold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{combined}</div>
      </div>

      {/* カード群（4x5） */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 gap-2 p-4 pt-16">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-white/95 rounded-md shadow-sm border border-neutral-200 p-1 flex items-center justify-center">
            {i === 0 ? (
              <div className="text-center leading-snug">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://placehold.co/40x40" alt="avatar" className="mx-auto rounded-full mb-1" />
                <div className="text-[10px] font-semibold">{recipient || "（未入力）"}</div>
                <div className="text-[9px]">{headline}</div>
              </div>
            ) : (
              <div className="h-2 w-3/4 bg-neutral-200 rounded" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


