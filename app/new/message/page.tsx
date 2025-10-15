"use client";

import StepBar from "../../../components/wizard/StepBar";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMessagePage() {
  // 初期値は空で描画し、マウント後に localStorage から同期（Hydration差異を回避）
  const [recipient, setRecipient] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [photo, setPhoto] = useState<string | null>(null);
  const router = useRouter();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const save = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("okurun:recipient", recipient);
      localStorage.setItem("okurun:headline", headline);
      if (photo) localStorage.setItem("okurun:recipientPhoto", photo);
    }
    router.push("/new/card");
  };

  // マウント後に localStorage を同期
  if (typeof window !== "undefined") {
    // 同期は一度だけでよい
    if (recipient === "" && headline === "" && photo === null) {
      const r = localStorage.getItem("okurun:recipient") || "";
      const h = localStorage.getItem("okurun:headline") || "";
      const p = localStorage.getItem("okurun:recipientPhoto");
      if (r !== recipient) setRecipient(r);
      if (h !== headline) setHeadline(h);
      if (p && p !== photo) setPhoto(p);
    }
  }

  return (
    <div>
      <StepBar current={1} />
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-neutral-800">送り出す人の情報</h1>
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-neutral-700 mb-1">送り出す人の名前</label>
              <input className="w-full rounded-xl border border-neutral-300 px-3 py-2" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-neutral-700 mb-1">送り出す人へのメッセージ（上部に大きく表示）</label>
              <input className="w-full rounded-xl border border-neutral-300 px-3 py-2" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="〇〇さん 卒業おめでとうございます！" />
            </div>
            <div>
              <label className="block text-sm text-neutral-700 mb-1">写真</label>
              <input type="file" accept="image/*" onChange={onFile} />
            </div>
            <div className="flex justify-end">
              <Button onClick={save}>保存して次へ</Button>
            </div>
          </Card>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-neutral-600">プレビュー</div>
          <Card className="p-6 flex items-center gap-3">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="recipient" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-neutral-200" />
            )}
            <div>
              <div className="text-sm text-neutral-600 whitespace-nowrap overflow-hidden text-ellipsis">
                {(recipient || "（未入力）") + (headline ? ` ${headline}` : "")}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


