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

// 固定カードサイズ
const CARD_WIDTH = 120;
const CARD_HEIGHT = 100;
const FONT_SIZE_NAME = 12;
const FONT_SIZE_MESSAGE = 10;
const AVATAR_SIZE = 24;

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

// デコスタンプの配置を生成（固定でHydrationエラーを回避）
const generateDecorations = (count: number) => {
  if (count > 3) return [];
  
  // 固定の配置でHydrationエラーを回避
  const fixedDecorations = [
    { id: 0, type: 'confetti', x: 20, y: 30, rotation: 15, scale: 1.0 },
    { id: 1, type: 'stamp', x: 70, y: 60, rotation: -20, scale: 0.9 },
    { id: 2, type: 'confetti', x: 40, y: 80, rotation: 45, scale: 1.1 },
  ];
  
  return fixedDecorations.slice(0, Math.min(count, 3));
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
  const decorations = mounted ? generateDecorations(totalCount) : []; // Hydrationエラー回避
  
  const combined = `${localRecipient} ${localHeadline}`.trim();

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
        maxHeight: "80vh"
      }}
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
      <div className="absolute left-4 right-4 top-4 px-3 py-2 flex justify-center" style={{ paddingTop: '20px' }}>
        <div className="flex items-center gap-6" style={{ width: 'calc(5/7 * (100% - 32px))' }}>
          {mounted && localPhoto ? (
            <img src={localPhoto} alt="" className="rounded-full object-cover flex-shrink-0" style={{ height: '80px', width: '80px' }} />
          ) : (
            <div className="rounded-full flex-shrink-0" style={{ backgroundColor: '#d1d5db', height: '80px', width: '80px' }} />
          )}
          <div className="font-semibold leading-tight flex-1" style={{ 
            color: '#000000', 
            lineHeight: '1.4',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.8), 1px -1px 2px rgba(255,255,255,0.8), -1px 1px 2px rgba(255,255,255,0.8)',
            fontSize: '28px'
          }}>
            {combined}
          </div>
        </div>
      </div>

      {/* メッセージカードグリッド */}
      <div 
        className="absolute inset-0 p-4"
        style={{ 
          paddingTop: '140px',
          paddingBottom: '20px',
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${CARD_WIDTH}px)`,
          gap: `${gap}px`,
          placeContent: totalCount <= 2 ? 'center' : 'start',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 受取人カード（最初のカード） */}
        <div 
          className="relative rounded-2xl shadow-lg flex flex-col items-center justify-center p-3 text-neutral-800"
          style={{
            width: `${CARD_WIDTH}px`,
            height: `${CARD_HEIGHT}px`,
            backgroundColor: localCardSrc ? 'transparent' : '#ffffff',
            backgroundImage: localCardSrc ? `url(${localCardSrc})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '20px'
          }}
        >
          {/* カードデザインがある場合は薄いオーバーレイ */}
          {localCardSrc && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />}
          
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ paddingTop: '25px' }}>
            {mounted && localPhoto ? (
              <img 
                src={localPhoto} 
                alt="" 
                className="rounded-full object-cover mb-2" 
                style={{ 
                  height: `${AVATAR_SIZE + 12}px`, 
                  width: `${AVATAR_SIZE + 12}px`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  position: 'absolute',
                  top: '-12px'
                }} 
              />
            ) : (
              <div 
                className="rounded-full mb-2" 
                style={{ 
                  height: `${AVATAR_SIZE + 12}px`, 
                  width: `${AVATAR_SIZE + 12}px`, 
                  backgroundColor: '#d1d5db',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  position: 'absolute',
                  top: '-12px'
                }} 
              />
            )}
            <div className="font-semibold text-center mb-1 px-1" style={{ 
              color: '#000000', 
              lineHeight: '1.3', 
              wordBreak: 'break-all',
              fontSize: `${FONT_SIZE_NAME}px`,
              marginTop: '12px'
            }}>
              {localRecipient}
            </div>
            <div className="text-center px-1" style={{ 
              color: '#000000', 
              lineHeight: '1.2', 
              wordBreak: 'break-all',
              fontSize: `${FONT_SIZE_MESSAGE}px`
            }}>
              {localHeadline}
            </div>
          </div>
        </div>

        {/* メッセージカード */}
        {messages.map((message, index) => (
          <div 
            key={message.id}
            className="relative rounded-2xl shadow-lg flex flex-col items-center justify-center p-3 text-neutral-800"
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              backgroundColor: localCardSrc ? 'transparent' : '#ffffff',
              backgroundImage: localCardSrc ? `url(${localCardSrc})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: '20px'
            }}
          >
            {/* カードデザインがある場合は薄いオーバーレイ */}
            {localCardSrc && <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }} />}
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ paddingTop: '25px' }}>
              {message.photo ? (
                <img 
                  src={message.photo} 
                  alt="" 
                  className="rounded-full object-cover mb-2" 
                  style={{ 
                    height: `${AVATAR_SIZE + 12}px`, 
                    width: `${AVATAR_SIZE + 12}px`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    position: 'absolute',
                    top: '-12px'
                  }} 
                />
              ) : (
                <div 
                  className="rounded-full mb-2 flex items-center justify-center" 
                  style={{ 
                    height: `${AVATAR_SIZE + 12}px`, 
                    width: `${AVATAR_SIZE + 12}px`, 
                    backgroundColor: 'rgba(255,107,107,0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    position: 'absolute',
                    top: '-12px'
                  }}
                >
                  <div className="rounded-full" style={{ 
                    height: `${AVATAR_SIZE / 2}px`, 
                    width: `${AVATAR_SIZE / 2}px`, 
                    backgroundColor: '#FF6B6B' 
                  }} />
                </div>
              )}
              <div className="font-semibold text-center mb-1 px-1" style={{ 
                color: '#000000', 
                lineHeight: '1.3', 
                wordBreak: 'break-all',
                fontSize: `${FONT_SIZE_NAME}px`,
                marginTop: '12px'
              }}>
                {message.name}
              </div>
              <div className="text-center px-1" style={{ 
                color: '#000000', 
                lineHeight: '1.2', 
                wordBreak: 'break-all',
                fontSize: `${FONT_SIZE_MESSAGE}px`
              }}>
                {message.message}
              </div>
            </div>
          </div>
        ))}
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
