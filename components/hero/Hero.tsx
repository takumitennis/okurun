import Link from "next/link";

type Props = {
  imageSrc?: string;
};

export default function Hero({ imageSrc }: Props) {
  const src =
    imageSrc ??
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop";

  return (
    <section className="mb-0">
      <div className="relative h-[280px] sm:h-[380px] md:h-[480px]">
        {/* 背景画像 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="みんなでお祝いしている様子" className="absolute inset-0 h-full w-full object-cover" />
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-black/40" />
        {/* テキスト */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">オンライン寄せ書きで気持ちを伝えよう</h1>
          <p className="text-white/90 max-w-2xl mb-6">OKURUNなら完全無料で寄せ書きを素早く作成できます</p>
          <Link href="/new" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
            今すぐ始める
          </Link>
        </div>
      </div>
    </section>
  );
}


