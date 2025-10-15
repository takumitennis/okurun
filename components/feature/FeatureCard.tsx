type Props = {
  icon: string; // emoji OK
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4 bg-white">
      <div className="text-2xl mb-2" aria-hidden>
        {icon}
      </div>
      <div className="font-medium text-neutral-800">{title}</div>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}


