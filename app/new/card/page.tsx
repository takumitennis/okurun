"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepBar from "../../../components/wizard/StepBar";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import PreviewBoard from "../../../components/board/PreviewBoard";

// APIから取得したカード一覧をクライアント側でキャッシュ
let cachedCards: any[] = [];

export default function CardPage() {
  const router = useRouter();
  const [designId, setDesignId] = useState<string | null>(null);
  const [designSrc, setDesignSrc] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>(cachedCards);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDesignId(localStorage.getItem("okurun:designId"));
      setDesignSrc(localStorage.getItem("okurun:designSrc"));
      const saved = localStorage.getItem("okurun:cardType");
      if (saved) setCardType(saved);
    }
    // カード一覧をロード
    if (cards.length === 0) {
      (async () => {
        try {
          const res = await fetch("/api/designs", { cache: "no-store" });
          const json = await res.json();
          if (Array.isArray(json.cards)) {
            cachedCards = json.cards;
            setCards(json.cards);
          }
        } catch (e) {
          console.error("failed to load cards", e);
        }
      })();
    }
  }, []);

  const chooseCard = (id: string) => {
    setCardType(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("okurun:cardType", id);
    }
  };

  const next = async () => {
    // 擬似insert（実運用時は Supabase クライアントに置換）
    const randomId = Math.random().toString(36).slice(2, 10);
    router.push(`/share/${randomId}`);
  };

  return (
    <div>
      <StepBar current={2} />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-sm text-neutral-600 mb-2">デザインプレビュー（{designId ?? "未選択"}）</div>
          <PreviewBoard src={designSrc ?? undefined} cardType={cardType} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((c: any) => (
            <Card key={c.id} className="p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="カード" className="h-24 w-full object-contain rounded-xl border border-neutral-200 mb-3" />
              <div className="font-medium text-neutral-800 mb-2">{c.id}</div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" className="h-9 px-3" onClick={() => chooseCard(c.id)}>試す</Button>
                <Button className="h-9 px-3" onClick={() => chooseCard(c.id)}>これにする</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={next} className="px-6 py-2" disabled={!cardType}>次へ</Button>
        </div>
      </div>
    </div>
  );
}


