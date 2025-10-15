"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepBar from "../../../components/wizard/StepBar";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Chip from "../../../components/ui/Chip";

type QA = {
  q: string;
  options: string[];
};

const qas: QA[] = [
  { q: "送り出す人の所属は？", options: ["学生", "社会人"] },
  { q: "性別は？", options: ["男", "女", "未回答"] },
  { q: "年齢は？", options: ["10代", "20代", "30〜40代", "50代以上"] },
  { q: "目的は？", options: ["卒業", "異動", "退職", "離任"] },
];

export default function AIPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [show, setShow] = useState(false);

  const choose = (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("okurun:designId", id);
    }
    router.push("/new/card");
  };

  return (
    <div>
      <StepBar current={1} />
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex gap-3">
          <Button variant="outline" className="px-4 py-2" onClick={() => router.push("/new/paper")}>デザインから選ぶ</Button>
          <Button className="px-4 py-2" onClick={() => router.push("/new/ai")}>AIにお任せする</Button>
        </div>

        {qas.map((qa, idx) => (
          <div key={idx} className="space-y-2">
            <div className="font-medium text-neutral-800">{qa.q}</div>
            <div className="flex flex-wrap gap-2">
              {qa.options.map((op) => (
                <button
                  key={op}
                  onClick={() => setAnswers({ ...answers, [idx]: op })}
                  className={`px-3 py-1 rounded-2xl text-sm border ${
                    answers[idx] === op
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-neutral-700 border-neutral-300"
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        ))}

        <Button className="px-5 py-2" onClick={() => setShow(true)}>候補を表示する</Button>

        {show && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["flower1", "dot1", "watercolor1", "wafu1"].map((id) => (
              <Card key={id} className="p-4">
                <div className="h-24 rounded-xl bg-neutral-100 border border-neutral-200" />
                <div className="mt-2 flex items-center justify-between">
                  <Chip appearance="tag" className="text-accent font-medium">おすすめ</Chip>
                  <Button className="h-9 px-3" onClick={() => choose(id)}>これにする</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


