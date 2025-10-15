"use client";
import { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  cardType?: string | null;
  bannerText?: string; // 例: 田中さん 卒業おめでとうございます！
  messages?: Array<{
    id: string;
    name: string;
    message: string;
    photo?: string | null;
  }>; // 実際のメッセージデータ
};

export default function PreviewBoard({ src, cardType, bannerText = "", messages = [] }: Props) {
  // PDF生成のために、初期状態から完全なデータを提供
  const [mounted, setMounted] = useState(false);
  const [recipient, setRecipient] = useState("山田さん");
  const [headline, setHeadline] = useState("今まで本当にありがとうございました！");
  const [photo, setPhoto] = useState<string | null>(null);
  const [cardSrc, setCardSrc] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedRecipient = localStorage.getItem("okurun:recipient");
      const savedHeadline = localStorage.getItem("okurun:headline");
      const savedPhoto = localStorage.getItem("okurun:recipientPhoto");
      
      if (savedRecipient) setRecipient(savedRecipient);
      if (savedHeadline) setHeadline(savedHeadline);
      if (savedPhoto) setPhoto(savedPhoto);
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

  const combined = `${recipient ? `${recipient} ` : ""}${headline}`.trim();
  
  // 実際のメッセージ数を計算（受取人情報 + 投稿メッセージ数）
  const totalMessageCount = 1 + (messages?.length || 0);
  
  // カード配置の計算
  const getCardLayout = (count: number) => {
    if (count <= 2) return { rows: 2, cols: 2, itemsPerRow: [count, 0] };
    if (count <= 4) return { rows: 2, cols: 3, itemsPerRow: [2, Math.max(0, count - 2)] };
    if (count <= 6) return { rows: 3, cols: 3, itemsPerRow: [2, 2, Math.max(0, count - 4)] };
    if (count <= 8) return { rows: 3, cols: 3, itemsPerRow: [3, 3, Math.max(0, count - 6)] };
    if (count <= 12) return { rows: 3, cols: 4, itemsPerRow: [4, 4, Math.max(0, count - 8)] };
    if (count <= 16) return { rows: 4, cols: 4, itemsPerRow: [4, 4, 4, Math.max(0, count - 12)] };
    // 20個以上は通常の4x5グリッド
    return { rows: 5, cols: 4, itemsPerRow: [4, 4, 4, 4, 4] };
  };
  
  const layout = getCardLayout(Math.min(totalMessageCount, 20));
  
  return (
    <div className="relative mx-auto w-full max-w-[480px] aspect-[242/273] bg-white" style={{ minHeight: '273px' }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={src} 
          alt="選択した色紙" 
          className="absolute inset-0 w-full h-full object-cover" 
          crossOrigin="anonymous"
          onLoad={() => console.log("Background image loaded")}
          onError={(e) => console.error("Background image failed to load:", e)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #eff6ff, #ecfdf5)' }} />
      )}

      {/* 上部バナー（送り先の写真＋一言） */}
      <div className="absolute left-3 right-3 top-4 px-3 py-2 flex items-center justify-center gap-2" style={{ paddingTop: '16px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {mounted && photo ? <img src={photo} alt="" className="rounded-full h-8 w-8 object-cover" /> : <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#d1d5db' }} />}
        <div className="text-[12px] font-semibold leading-tight text-center" style={{ 
          color: '#000000', 
          lineHeight: '1.4',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8), 1px -1px 2px rgba(255,255,255,0.8), -1px 1px 2px rgba(255,255,255,0.8)'
        }}>
          {combined}
        </div>
      </div>

      {/* メッセージカード群（動的配置） */}
      <div className="absolute inset-0 p-4" style={{ paddingTop: '60px' }}>
        <div className="h-full flex flex-col justify-center gap-2">
          {Array.from({ length: layout.rows }).map((_, rowIndex) => {
            const itemsInRow = layout.itemsPerRow[rowIndex] || 0;
            if (itemsInRow === 0) return null;
            
            return (
              <div key={rowIndex} className="flex justify-center gap-2">
                {Array.from({ length: itemsInRow }).map((_, colIndex) => {
                  const globalIndex = layout.itemsPerRow.slice(0, rowIndex).reduce((sum, count) => sum + count, 0) + colIndex;
                  
                  // カードデザインを背景に適用
                  const cardStyle = cardSrc ? {
                    backgroundImage: `url(${cardSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderColor: '#e5e7eb'
                  } : { borderColor: '#e5e7eb' };
                  
                  return (
                    <div 
                      key={`${rowIndex}-${colIndex}`}
                      className="rounded-md shadow-sm border p-2 flex flex-col items-center justify-center text-center relative overflow-hidden"
                      style={{ 
                        ...cardStyle, 
                        width: '60px', 
                        height: '70px',
                        minWidth: '60px',
                        minHeight: '70px'
                      }}
                    >
                      {/* カードデザインがある場合は薄いオーバーレイを追加 */}
                      {cardSrc && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />}
                      
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        {globalIndex === 0 ? (
                          // 最初のカードは受取人情報
                          <>
                            {mounted && photo ? (
                              <img src={photo} alt="" className="h-5 w-5 rounded-full object-cover mb-1" />
                            ) : (
                              <div className="h-5 w-5 rounded-full mb-1" style={{ backgroundColor: '#e5e7eb' }} />
                            )}
                            <div className="text-[8px] font-semibold leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.3', wordBreak: 'break-all' }}>
                              {recipient}
                            </div>
                            <div className="text-[7px] leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.2', wordBreak: 'break-all' }}>
                              {headline}
                            </div>
                          </>
                        ) : messages[globalIndex - 1] ? (
                          // 実際のメッセージデータがある場合
                          <>
                            {messages[globalIndex - 1].photo ? (
                              <img src={messages[globalIndex - 1].photo} alt="" className="h-5 w-5 rounded-full object-cover mb-1" />
                            ) : (
                              <div className="h-5 w-5 rounded-full mb-1 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,107,107,0.2)' }}>
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
                              </div>
                            )}
                            <div className="text-[8px] font-semibold leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.3', wordBreak: 'break-all' }}>
                              {messages[globalIndex - 1].name}
                            </div>
                            <div className="text-[7px] leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.2', wordBreak: 'break-all' }}>
                              {messages[globalIndex - 1].message}
                            </div>
                          </>
                        ) : globalIndex === 1 ? (
                          // 2番目のカードはサンプルメッセージ（メッセージがない場合）
                          <>
                            <div className="h-5 w-5 rounded-full mb-1 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,107,107,0.2)' }}>
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
                            </div>
                            <div className="text-[8px] font-semibold leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.3', wordBreak: 'break-all' }}>
                              田中さん
                            </div>
                            <div className="text-[7px] leading-tight text-center px-1" style={{ color: '#000000', lineHeight: '1.2', wordBreak: 'break-all' }}>
                              お疲れ様でした！
                            </div>
                          </>
                        ) : (
                          // その他のカードは空のプレースホルダー
                          <>
                            <div className="h-5 w-5 rounded-full mb-1" style={{ backgroundColor: '#e5e7eb' }} />
                            <div className="h-1.5 w-full rounded mb-1" style={{ backgroundColor: '#e5e7eb' }} />
                            <div className="h-1 w-3/4 rounded" style={{ backgroundColor: '#e5e7eb' }} />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


