"use client";
import { useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  message: string;
  photo?: string | null;
};

type Props = {
  messages: Message[];
  designSrc?: string | null;
  cardSrc?: string | null;
  recipient?: string;
  headline?: string;
  recipientPhoto?: string | null;
};

// 列数を決定する関数
const pickCols = (count: number): number => {
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  if (count <= 12) return 4;
  return 5;
};

// ギャップを決定する関数
const pickGap = (count: number): number => {
  if (count <= 2) return 24;
  if (count <= 6) return 16;
  return 12;
};

// デコスタンプの配置を生成
const generateDecorations = (count: number) => {
  if (count > 3) return [];
  
  const decorations = [];
  const numDecorations = Math.floor(Math.random() * 3) + 2; // 2-4個
  
  for (let i = 0; i < numDecorations; i++) {
    decorations.push({
      id: i,
      type: Math.random() > 0.5 ? 'confetti' : 'stamp',
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 80 + 10, // 10-90%
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
    });
  }
  
  return decorations;
};

export default function BoardPreview({ 
  messages, 
  designSrc, 
  cardSrc, 
  recipient = "山田さん", 
  headline = "今まで本当にありがとうございました！", 
  recipientPhoto 
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [localRecipient, setLocalRecipient] = useState(recipient);
  const [localHeadline, setLocalHeadline] = useState(headline);
  const [localPhoto, setLocalPhoto] = useState<string | null>(recipientPhoto || null);
  const [localDesignSrc, setLocalDesignSrc] = useState(designSrc);
  const [localCardSrc, setLocalCardSrc] = useState(cardSrc);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedRecipient = localStorage.getItem("okurun:recipient");
      const savedHeadline = localStorage.getItem("okurun:headline");
      const savedPhoto = localStorage.getItem("okurun:recipientPhoto");
      const savedDesignSrc = localStorage.getItem("okurun:designSrc");
      const savedCardSrc = localStorage.getItem("okurun:cardSrc");
      
      if (savedRecipient) setLocalRecipient(savedRecipient);
      if (savedHeadline) setLocalHeadline(savedHeadline);
      if (savedPhoto) setLocalPhoto(savedPhoto);
      if (savedDesignSrc) setLocalDesignSrc(savedDesignSrc);
      if (savedCardSrc) setLocalCardSrc(savedCardSrc);
    }
  }, []);

  const totalCount = 1 + messages.length; // 受取人 + メッセージ数
  const cols = pickCols(totalCount);
  const gap = pickGap(totalCount);
  const decorations = generateDecorations(totalCount);
  
  const combined = `${localRecipient} ${localHeadline}`.trim();

  // カードのスタイルを決定
  const getCardStyle = (index: number) => {
    const isLargeCard = totalCount <= 2;
    const cardClass = isLargeCard ? "card--xl" : "card";
    
    return {
      className: cardClass,
      style: {
        width: isLargeCard ? "clamp(280px, 40vw, 520px)" : "clamp(160px, calc(100% - var(--gap)), 280px)",
        aspectRatio: "3/2",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        background: localCardSrc ? `url(${localCardSrc})` : "#ffffff",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative" as const,
        overflow: "hidden" as const,
        border: "1px solid rgba(255, 255, 255, 0.8)"
      }
    };
  };

  return (
    <section 
      id="yosegaki-preview"
      className="relative w-full h-full bg-white"
      style={{
        width: "min(242mm, 80vw)",
        height: "min(273mm, 80vh)",
        minWidth: "320px",
        minHeight: "360px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        "--cols": cols,
        "--gap": `${gap}px`,
        "--gap-px": gap
      } as React.CSSProperties}
    >
      {/* 背景画像 */}
      {localDesignSrc ? (
        <img 
          src={localDesignSrc} 
          alt="選択した色紙" 
          className="absolute inset-0 w-full h-full object-cover" 
          crossOrigin="anonymous"
          onLoad={() => console.log("Background image loaded successfully:", localDesignSrc)}
          onError={(e) => console.error("Background image failed to load:", localDesignSrc, e)}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #eff6ff, #ecfdf5)' }} />
      )}

      {/* 上部バナー */}
      <div className="absolute left-4 right-4 top-4 px-3 py-2 flex items-center justify-center gap-2" style={{ paddingTop: '20px' }}>
        {mounted && localPhoto ? (
          <img src={localPhoto} alt="" className="rounded-full h-8 w-8 object-cover" />
        ) : (
          <div className="h-8 w-8 rounded-full" style={{ backgroundColor: '#d1d5db' }} />
        )}
        <div className="text-[12px] font-semibold leading-tight text-center" style={{ 
          color: '#000000', 
          lineHeight: '1.4',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8), 1px -1px 2px rgba(255,255,255,0.8), -1px 1px 2px rgba(255,255,255,0.8)'
        }}>
          {combined}
        </div>
      </div>

      {/* メッセージカードグリッド */}
      <div 
        className="absolute inset-0 p-4"
        style={{ 
          paddingTop: '70px',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap}px`,
          placeContent: totalCount <= 2 ? 'center' : 'start',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 受取人カード（最初のカード） */}
        <div {...getCardStyle(0)}>
          {/* カードデザインがある場合は薄いオーバーレイ */}
          {localCardSrc && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />}
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
            {mounted && localPhoto ? (
              <img src={localPhoto} alt="" className="rounded-full object-cover mb-3" style={{ 
                height: totalCount <= 2 ? '48px' : '32px', 
                width: totalCount <= 2 ? '48px' : '32px' 
              }} />
            ) : (
              <div className="rounded-full mb-3" style={{ 
                height: totalCount <= 2 ? '48px' : '32px', 
                width: totalCount <= 2 ? '48px' : '32px', 
                backgroundColor: '#d1d5db' 
              }} />
            )}
            <h3 className="font-semibold text-center mb-2 px-2" style={{ 
              color: '#000000', 
              lineHeight: '1.3', 
              wordBreak: 'break-all',
              fontSize: totalCount <= 2 ? 'clamp(16px, 2vw, 24px)' : 'clamp(14px, 1.4vw, 18px)'
            }}>
              {localRecipient}
            </h3>
            <p className="text-center px-2" style={{ 
              color: '#000000', 
              lineHeight: '1.2', 
              wordBreak: 'break-all',
              fontSize: totalCount <= 2 ? 'clamp(14px, 1.5vw, 20px)' : 'clamp(12px, 1.2vw, 16px)'
            }}>
              {localHeadline}
            </p>
          </div>
        </div>

        {/* メッセージカード */}
        {messages.map((message, index) => {
          const cardStyle = getCardStyle(index + 1);
          return (
            <div key={message.id} {...cardStyle}>
              {/* カードデザインがある場合は薄いオーバーレイ */}
              {localCardSrc && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />}
              
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                {message.photo ? (
                  <img src={message.photo} alt="" className="rounded-full object-cover mb-3" style={{ 
                    height: totalCount <= 2 ? '48px' : '32px', 
                    width: totalCount <= 2 ? '48px' : '32px' 
                  }} />
                ) : (
                  <div className="rounded-full mb-3 flex items-center justify-center" style={{ 
                    height: totalCount <= 2 ? '48px' : '32px', 
                    width: totalCount <= 2 ? '48px' : '32px', 
                    backgroundColor: 'rgba(255,107,107,0.2)' 
                  }}>
                    <div className="rounded-full" style={{ 
                      height: totalCount <= 2 ? '24px' : '16px', 
                      width: totalCount <= 2 ? '24px' : '16px', 
                      backgroundColor: '#FF6B6B' 
                    }} />
                  </div>
                )}
                <h3 className="font-semibold text-center mb-2 px-2" style={{ 
                  color: '#000000', 
                  lineHeight: '1.3', 
                  wordBreak: 'break-all',
                  fontSize: totalCount <= 2 ? 'clamp(16px, 2vw, 24px)' : 'clamp(14px, 1.4vw, 18px)'
                }}>
                  {message.name}
                </h3>
                <p className="text-center px-2" style={{ 
                  color: '#000000', 
                  lineHeight: '1.2', 
                  wordBreak: 'break-all',
                  fontSize: totalCount <= 2 ? 'clamp(14px, 1.5vw, 20px)' : 'clamp(12px, 1.2vw, 16px)'
                }}>
                  {message.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* デコスタンプ（3枚以下の場合のみ） */}
      {decorations.map((decoration) => (
        <div
          key={decoration.id}
          className="absolute pointer-events-none"
          style={{
            left: `${decoration.x}%`,
            top: `${decoration.y}%`,
            transform: `rotate(${decoration.rotation}deg) scale(${decoration.scale})`,
            opacity: 0.15,
            fontSize: '24px'
          }}
        >
          {decoration.type === 'confetti' ? '🎉' : '✨'}
        </div>
      ))}
    </section>
  );
}
