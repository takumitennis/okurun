import Hero from "../components/hero/Hero";
import DesignCard from "../components/design/DesignCard";
import FeatureCard from "../components/feature/FeatureCard";
import { designCards, features } from "../lib/constants/home";
import FeatureSection from "../components/feature/FeatureSection";

export default function Home() {
  return (
    <div className="mx-auto px-2 sm:px-4 py-8">
      {/* Hero */}
      <Hero />

      {/* デザイン紹介 */}
      <section className="my-10">
        <h2 className="text-xl font-semibold text-neutral-800 mb-4">おすすめデザイン</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designCards.map((d) => (
            <DesignCard key={d.title} {...d} />
          ))}
        </div>
      </section>

      {/* スゴヨセ風 特徴セクション */}
      <FeatureSection />
    </div>
  );
}
