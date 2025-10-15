"use client";

import { useRouter } from "next/navigation";
import StepBar from "../../../components/wizard/StepBar";
import Card from "../../../components/ui/Card";
import Chip from "../../../components/ui/Chip";
import Button from "../../../components/ui/Button";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const categories = ["シンプル", "花柄", "水玉", "水彩", "和風", "ボタニカル"] as const;

// クライアント側でのローカルキャッシュ（ページ再訪で再リクエストを避ける）
let cachedPapers: any[] = [];

export default function PaperPage() {
  const router = useRouter();
  const [active, setActive] = useState<string>("all");
  const [papers, setPapers] = useState<any[]>(cachedPapers);

  // 初回はAPIから確実に取得する
  useEffect(() => {
    if (papers.length > 0) return;
    (async () => {
      try {
        const res = await fetch("/api/designs", { cache: "no-store" });
        const json = await res.json();
        if (Array.isArray(json.papers)) {
          cachedPapers = json.papers;
          setPapers(json.papers);
        }
      } catch (e) {
        console.error("failed to load designs", e);
      }
    })();
  }, [papers.length]);

  const choose = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("okurun:designId", id);
      const found = papers.find((p: any) => p.id === id);
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
    const keys = Array.from(new Set(papers.map((p: any) => p.category)));
    // 全件（all）は固定のため 'all'、シンプルは 'simple'、カテゴリ名は 'cat:<name>' にして重複を確実に避ける
    return [
      { key: "all", label: "すべて" },
      { key: "simple", label: "シンプル" },
      ...keys.map((k: string) => ({ key: `cat:${k}`, label: map[k] ?? k })),
    ];
  }, [papers]);

  const filtered = useMemo(() => {
    if (active === "all") return papers;
    if (active === "simple") return papers; // 現状は同義。将来テンプレのタグで分岐可能
    if (active.startsWith("cat:")) {
      const cat = active.slice(4);
      return papers.filter((p: any) => p.category === cat);
    }
    return papers;
  }, [active, papers]);

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
            <Card key={d.id} className="p-4 shadow-sm">
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

        {/* ページャは不要のため非表示 */}
        <div className="flex justify-end">
          <Button onClick={() => router.push("/new/message")} className="px-6 py-2">送り出す人の情報を入力へ</Button>
        </div>
      </div>
    </div>
  );
}


