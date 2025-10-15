type Props = {
  current: 1 | 2 | 3;
};

function Step({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={
        "flex-1 text-center rounded-2xl px-3 py-2 text-sm font-medium " +
        (active
          ? "bg-brand text-white"
          : "bg-neutral-200 text-neutral-700 italic")
      }
    >
      {label}
    </div>
  );
}

export default function StepBar({ current }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <div className="flex items-center gap-2">
        <Step label="STEP1 色紙を選ぶ" active={current === 1} />
        <Step label="STEP2 カードを選ぶ" active={current === 2} />
        <Step label="STEP3 みんなに送る" active={current === 3} />
      </div>
    </div>
  );
}


