export default function FAQPage() {
  const faqs = [
    { q: "Q. OKURUNは無料ですか？", a: "はい、すべて無料でご利用いただけます。PDFのダウンロードも無料です。" },
    { q: "Q. 登録しないと使えませんか？", a: "登録なしでも作成・共有が可能です（マイページ機能は要ログイン）。" },
    { q: "Q. 写真は添付できますか？", a: "はい、カードの種類によって写真付きレイアウトを選べます。" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">よくある質問</h1>
      <div className="divide-y divide-neutral-200">
        {faqs.map((f) => (
          <div key={f.q} className="py-5">
            <div className="font-medium text-neutral-800">{f.q}</div>
            <div className="text-neutral-600">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


