import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Link from "next/link";

export type DesignData = {
  id: string;
  title: string;
  category: string; // 花柄 / 水玉 など
  tags: string[];
  description: string;
};

export default function DesignDetail({ design }: { design: DesignData }) {
  const btnClass =
    "inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium transition-colors shadow-sm bg-brand text-white hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* プレビュー */}
      <Card className="lg:col-span-2 p-4">
        <div className="aspect-[4/3] w-full rounded-xl bg-neutral-100 border border-neutral-200" />
      </Card>

      {/* 情報パネル */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-800">{design.title}</h1>
          <Chip appearance="tag" className="w-fit font-semibold text-neutral-700">{design.category}</Chip>
        </div>

        <div className="flex flex-wrap gap-2">
          {design.tags.map((t) => (
            <Chip key={t} appearance="tag" className="text-accent font-medium">{t}</Chip>
          ))}
        </div>

        <Card className="p-4">
          <p className="leading-7 text-neutral-600">{design.description}</p>
        </Card>

        <Link href={`/new?designId=${design.id}`} className={btnClass}>
          このデザインで作る
        </Link>
      </div>
    </div>
  );
}


