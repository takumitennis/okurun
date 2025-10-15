import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// 本実装では認証・DB連携を行う。ここではダミーデータ＋ダミーAPIで再DL/編集を表現
type Board = { id: string; title: string; createdAt: string; pdfUrl?: string; status: "open" | "closed" };
const myBoards: Board[] = [
  { id: "abc12345", title: "送別会の寄せ書き", createdAt: "2025-03-01", pdfUrl: "/dummy.pdf", status: "open" },
  { id: "xyz67890", title: "卒業おめでとう", createdAt: "2025-02-10", pdfUrl: "/dummy.pdf", status: "closed" },
];

function daysFrom(dateStr: string) {
  const d = new Date(dateStr).getTime();
  const diff = Date.now() - d;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function MePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-800">マイページ</h1>
      <div className="grid grid-cols-1 gap-4">
        {myBoards.map((b) => {
          const within3Months = daysFrom(b.createdAt) <= 90;
          return (
            <Card key={b.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-800">{b.title}</div>
                <div className="text-sm text-neutral-600">作成日: {b.createdAt}</div>
                <div className="text-sm text-neutral-600">URL: https://okurun.jp/b/{b.id}</div>
              </div>
              <div className="flex gap-2 items-center">
                {within3Months ? (
                  <button
                    className="px-3 h-9 inline-flex items-center justify-center rounded-2xl border border-brand text-brand hover:bg-brand/10 text-sm"
                    onClick={async () => {
                      const res = await fetch("/api/pdf", { method: "POST", body: JSON.stringify({ html: "<div>OKURUN PDF</div>" }) });
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `okurun-${b.id}.pdf`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    PDFを再ダウンロード
                  </button>
                ) : (
                  <span className="text-xs text-neutral-500">PDF再DL期限切れ（3ヶ月）</span>
                )}
                {b.status === "open" ? (
                  <Button variant="outline" className="px-3 h-9" onClick={() => location.assign(`/b/${b.id}`)}>編集</Button>
                ) : (
                  <span className="text-xs text-neutral-500">募集終了</span>
                )}
                <Button variant="secondary" className="px-3 h-9">削除（仮）</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


