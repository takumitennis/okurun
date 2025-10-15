import DesignDetail, { DesignData } from "../../../components/design/DesignDetail";

export const revalidate = 3600;

const ids = ["flower1", "dot1", "watercolor1", "wafu1"] as const;

const designDB: Record<string, DesignData> = {
  flower1: {
    id: "flower1",
    title: "花柄 - フローラル",
    category: "花柄",
    tags: ["シンプル", "華やか"],
    description:
      "やさしい花柄をあしらった使いやすいデザイン。送別やお祝いなど幅広いシーンに合います。",
  },
  dot1: {
    id: "dot1",
    title: "水玉 - ドット",
    category: "水玉",
    tags: ["カジュアル", "ポップ"],
    description:
      "明るい水玉模様でポップな印象。カジュアルな寄せ書きにぴったりです。",
  },
  watercolor1: {
    id: "watercolor1",
    title: "水彩 - ウォーターカラー",
    category: "水彩",
    tags: ["やわらかい", "落ち着き"],
    description:
      "水彩のグラデーションが上品なデザイン。フォーマルな場面にも合います。",
  },
  wafu1: {
    id: "wafu1",
    title: "和風 - 和紙風",
    category: "和風",
    tags: ["渋い", "上品"],
    description:
      "和紙の質感をイメージした落ち着いた和風デザイン。年配の方にも好まれます。",
  },
};

export function generateStaticParams() {
  return ids.map((id) => ({ id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const design = designDB[params.id];
  if (!design) {
    return <div>Not found</div>;
  }
  return <DesignDetail design={design} />;
}


