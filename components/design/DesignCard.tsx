import Link from "next/link";
import Card from "../ui/Card";

type Props = {
  src: string;
  title: string;
  caption: string;
  href: string;
};

export default function DesignCard({ src, title, caption, href }: Props) {
  return (
    <Card className="overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-medium text-neutral-800">{title}</h3>
        <p className="text-sm text-neutral-600 mb-3">{caption}</p>
        <Link href={href} className="inline-block px-4 py-2 rounded-2xl border border-accent text-accent hover:bg-accent/10">
          これにする
        </Link>
      </div>
    </Card>
  );
}


