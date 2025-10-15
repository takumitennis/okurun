type Feature = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

function FeatureItem({ feature, reverse }: { feature: Feature; reverse?: boolean }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center py-10">
      {/* 画像 */}
      <div className={`${reverse ? "md:order-2" : "md:order-1"} order-1`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={feature.src}
          alt={feature.alt}
          className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-2xl border border-neutral-200"
        />
      </div>
      {/* テキスト */}
      <div className={`${reverse ? "md:order-1" : "md:order-2"} order-2`}>
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">{feature.title}</h3>
        <p className="text-neutral-600 leading-7">{feature.text}</p>
      </div>
    </div>
  );
}

export default function FeatureSection() {
  const items: Feature[] = [
    {
      src: "/features/free.svg",
      alt: "無料で使える",
      title: "全て無料で使える",
      text:
        "デザインを選んでメッセージを集めるだけ。OKURUNは完全無料で寄せ書きを作成できます。他のサービスでは有料のPDFダウンロードも無料。写真付きでの出力も可能です。",
    },
    {
      src: "/features/easy.svg",
      alt: "簡単操作",
      title: "直感的で簡単な操作",
      text: "スマホでもパソコンでもOK。シンプルなUIで誰でもすぐに寄せ書きを作れます。",
    },
    {
      src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1200&auto=format&fit=crop",
      alt: "URL共有",
      title: "相手の住所を知らなくても贈れる",
      text: "共有リンクを送るだけでOK。受け取る側もアプリ不要で簡単に閲覧できます。",
    },
    {
      src: "https://images.unsplash.com/photo-1515165562835-c3b8c0a0a6a6?q=80&w=1200&auto=format&fit=crop",
      alt: "写真を添えられる",
      title: "写真や画像を添えて贈れる",
      text: "メッセージと一緒に写真もアップロード可能。思い出を形に残せます。",
    },
  ].map((f) => ({
    // 画像ファイルが無い環境向けのフォールバック
    ...f,
    src: typeof window === "undefined" ? f.src : f.src,
  }));

  // /public に画像が無い場合の代替URL
  const fallback = "https://placehold.co/600x400";
  const withFallback = items.map((i) => ({ ...i, src: i.src.startsWith("/") ? i.src : i.src || fallback }));

  return (
    <section id="features" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-brand">OKURUNの特徴</h2>
        <div className="divide-y divide-neutral-100">
          {withFallback.map((f, idx) => (
            <FeatureItem key={f.title} feature={f} reverse={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}


