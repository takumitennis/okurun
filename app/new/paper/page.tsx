"use client";

import { useRouter } from "next/navigation";
import StepBar from "../../../components/wizard/StepBar";
import Card from "../../../components/ui/Card";
import Chip from "../../../components/ui/Chip";
import Button from "../../../components/ui/Button";
import Link from "next/link";
import { useMemo, useState } from "react";
import { readPaperDesigns } from "../../../lib/designs";

const categories = ["シンプル", "花柄", "水玉", "水彩", "和風", "ボタニカル"] as const;
// サーバーデータを埋め込み（layout等を使わず簡易注入）
// @ts-expect-error
const serverPapers = typeof window === "undefined" ? [] : (window as any).__paperDesigns || [];

export default function PaperPage() {
  const router = useRouter();
  const [active, setActive] = useState<string>("all");

  const choose = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("okurun:designId", id);
      const found = serverPapers.find((p: any) => p.id === id);
      if (found) {
        localStorage.setItem("okurun:designSrc", found.src);
        localStorage.setItem("okurun:designCategory", found.category);
      }
    }
    // デザイン選択後に「送り出す人の入力」へ遷移
    router.push("/new/message");
  };

  const derivedCategories: { key: string; label: string }[] = useMemo(() => {
    const map: Record<string, string> = { flower: "花柄", dot: "水玉", watercolor: "水彩", wafu: "和風", botanical: "ボタニカル" };
    const keys = Array.from(new Set(serverPapers.map((p: any) => p.category)));
    return [{ key: "all", label: "すべて" }, { key: "simple", label: "シンプル" }, ...keys.map((k: string) => ({ key: k, label: map[k] ?? k }))];
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return serverPapers;
    if (active === "simple") return serverPapers; // 現状は同義。将来テンプレのタグで分岐可能
    return serverPapers.filter((p: any) => p.category === active);
  }, [active]);

  return (
    <div>
      <StepBar current={1} />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-3">
          <Button className="px-4 py-2" onClick={() => setActive("all")}>デザインから選ぶ</Button>
          <Link href="/new/ai"><Button variant="outline" className="px-4 py-2">AIにお任せする</Button></Link>
        </div>

        <div className="flex flex-wrap gap-2" suppressHydrationWarning>
          {derivedCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`px-3 py-1 rounded-2xl text-sm border ${
                active === c.key
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-neutral-700 border-neutral-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d: any) => (
            <Card key={d.id} className="p-4">
              <div className="h-56 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {d.src ? (
                  <img src={d.src} alt={d.title ?? d.category} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-neutral-800">{d.title ?? d.id}</div>
                  <Chip appearance="tag" className="mt-1 text-accent font-medium">{d.category}</Chip>
                </div>
                <Button onClick={() => choose(d.id)} className="h-9 px-3">これにする</Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-neutral-600">1 / 4</div>
        <div className="flex justify-end">
          <Button onClick={() => router.push("/new/message")} className="px-6 py-2">送り出す人の情報を入力へ</Button>
        </div>
      </div>
    </div>
  );
}


