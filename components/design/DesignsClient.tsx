"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import Link from "next/link";

export type PaperItem = { id: string; category: string; src: string };
export type CardItem = { id: string; src: string };

const categoryLabel: Record<string, string> = {
  flower: "花柄",
  dot: "水玉",
  watercolor: "水彩",
  wafu: "和風",
};

export default function DesignsClient({ papers, cards }: { papers: PaperItem[]; cards: CardItem[] }) {
  const [tab, setTab] = useState<"paper" | "card">("paper");
  const cats = Array.from(new Set(papers.map((p) => p.category)));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-neutral-800">デザイン一覧</h1>

      <div className="flex gap-2">
        <button onClick={() => setTab("paper")} className={`px-4 py-2 rounded-2xl border ${tab === "paper" ? "bg-brand text-white border-brand" : "bg-white text-neutral-700 border-neutral-300"}`}>色紙</button>
        <button onClick={() => setTab("card")} className={`px-4 py-2 rounded-2xl border ${tab === "card" ? "bg-brand text-white border-brand" : "bg-white text-neutral-700 border-neutral-300"}`}>カード</button>
      </div>

      {tab === "paper" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((item) => (
            <Card key={`${item.category}-${item.id}`} className="p-4">
              {/* 画像は追加サイズを優先（height固定なし、object-contain） */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={`${categoryLabel[item.category] ?? item.category} デザイン`} className="w-full rounded-xl border border-neutral-200 object-contain" />
              <div className="mt-3 flex items-center justify-between">
                <Chip appearance="tag" className="font-semibold text-neutral-700">{categoryLabel[item.category] ?? item.category}</Chip>
                <Link href={`/new/paper`}>
                  <Button variant="outline" className="h-9 px-3">選ぶ</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item) => (
            <Card key={item.id} className="p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="カードデザイン" className="w-full rounded-xl border border-neutral-200 object-contain" />
              <div className="mt-3 flex items-center justify-between">
                <Chip appearance="tag" className="font-semibold text-neutral-700">カード</Chip>
                <Link href={`/new/card`}>
                  <Button variant="outline" className="h-9 px-3">使う</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


