"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Board {
  id: string;
  title: string;
  createdAt: string;
  url: string;
}

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // ダミーデータ（実際はAPIから取得）
      const dummyBoards: Board[] = [
        {
          id: "abc123",
          title: "田中さんの送別会",
          createdAt: "2024-01-15",
          url: "/share/abc123"
        },
        {
          id: "def456",
          title: "山田さんの退職記念",
          createdAt: "2024-01-10",
          url: "/share/def456"
        }
      ];
      
      setBoards(dummyBoards);
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto"></div>
          <p className="mt-2 text-neutral-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleEditBoard = (boardId: string) => {
    // 編集機能（今後実装）
    console.log("Edit board:", boardId);
  };

  const handleDownloadPdf = (boardId: string) => {
    // PDFダウンロード機能（今後実装）
    console.log("Download PDF:", boardId);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (confirm("この寄せ書きを削除しますか？")) {
      // 削除機能（今後実装）
      console.log("Delete board:", boardId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">マイページ</h1>
        <p className="text-neutral-600">
          作成した寄せ書きの管理や設定を行うことができます。
        </p>
        <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
          <p className="text-sm text-neutral-700">
            <strong>ログイン中:</strong> {session.user?.name || session.user?.email}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            作成した寄せ書き ({boards.length}件)
          </h2>
          <Button 
            onClick={() => router.push("/new/paper")}
            variant="primary"
          >
            新しい寄せ書きを作成
          </Button>
        </div>

        {boards.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-neutral-500 mb-4">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              まだ寄せ書きを作成していません
            </h3>
            <p className="text-neutral-600 mb-4">
              最初の寄せ書きを作成してみましょう！
            </p>
            <Button 
              onClick={() => router.push("/new/paper")}
              variant="primary"
            >
              寄せ書きを作成する
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {boards.map((board) => (
              <Card key={board.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {board.title}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-2">
                      作成日: {new Date(board.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono">
                      ID: {board.id}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => router.push(board.url)}
                      variant="outline"
                      className="text-xs px-3 py-1"
                    >
                      表示
                    </Button>
                    <Button
                      onClick={() => handleEditBoard(board.id)}
                      variant="outline"
                      className="text-xs px-3 py-1"
                    >
                      編集
                    </Button>
                    <Button
                      onClick={() => handleDownloadPdf(board.id)}
                      variant="outline"
                      className="text-xs px-3 py-1"
                    >
                      PDF出力
                    </Button>
                    <Button
                      onClick={() => handleDeleteBoard(board.id)}
                      variant="outline"
                      className="text-xs px-3 py-1 text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}