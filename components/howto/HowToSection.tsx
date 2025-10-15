type Step = {
  src: string;
  alt: string;
  title: string;
  text: string;
  ctaHref?: string;
  ctaLabel?: string;
};

import Link from "next/link";
import Button from "../ui/Button";

function HowToItem({ step, reverse }: { step: Step; reverse?: boolean }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center py-10">
      <div className={`${reverse ? "md:order-2" : "md:order-1"} order-1`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={step.src}
          alt={step.alt}
          className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-2xl border border-neutral-200"
        />
      </div>
      <div className={`${reverse ? "md:order-1" : "md:order-2"} order-2`}>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{step.title}</h3>
        <p className="text-neutral-600 leading-7 mb-3">{step.text}</p>
        {step.ctaHref && (
          <Link href={step.ctaHref}>
            <Button className="px-4 py-2">{step.ctaLabel || "はじめる"}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function HowToSection() {
  const steps: Step[] = [
    {
      src: "https://placehold.co/600x400?text=STEP1",
      alt: "STEP1",
      title: "STEP1: デザインを選ぶ（作成する → デザインから選ぶ）",
      text: "まずは色紙（背景）を選びます。画面上部の『デザインから選ぶ / AIにお任せする』のタブからいつでも切り替え可能です。",
      ctaHref: "/new/paper",
      ctaLabel: "デザインを選ぶ",
    },
    {
      src: "https://placehold.co/600x400?text=STEP2",
      alt: "STEP2",
      title: "STEP2: カードを選ぶ",
      text: "縦型・横型・写真ありなどレイアウトを選択します。",
    },
    {
      src: "https://placehold.co/600x400?text=STEP3",
      alt: "STEP3",
      title: "STEP3: URLを共有",
      text: "URLを送ってみんなに書いてもらいましょう。アプリ不要で誰でも参加できます。",
    },
    {
      src: "https://placehold.co/600x400?text=STEP4",
      alt: "STEP4",
      title: "STEP4: 完成・ダウンロード",
      text: "完成したらPDFでダウンロードして保存や印刷が可能です（無料）。",
    },
  ];

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">使い方</h2>
        <div className="divide-y divide-neutral-100">
          {steps.map((s, idx) => (
            <HowToItem key={s.title} step={s} reverse={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}


