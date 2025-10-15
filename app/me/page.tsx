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
  status: "draft" | "active" | "completed";
  messageCount: number;
  recipientName: string;
}

type TabType = "profile" | "active" | "completed" | "drafts";

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("profile");

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
          url: "/share/abc123",
          status: "active",
          messageCount: 12,
          recipientName: "田中さん"
        },
        {
          id: "def456",
          title: "山田さんの退職記念",
          createdAt: "2024-01-10",
          url: "/share/def456",
          status: "completed",
          messageCount: 20,
          recipientName: "山田さん"
        },
        {
          id: "ghi789",
          title: "佐藤さんの誕生日",
          createdAt: "2024-01-05",
          url: "/share/ghi789",
          status: "draft",
          messageCount: 0,
          recipientName: "佐藤さん"
        },
        {
          id: "jkl012",
          title: "鈴木さんの昇進祝い",
          createdAt: "2024-01-20",
          url: "/share/jkl012",
          status: "active",
          messageCount: 8,
          recipientName: "鈴木さん"
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

  const tabs = [
    { id: "profile" as TabType, label: "プロフィール", icon: "👤" },
    { id: "active" as TabType, label: "進行中", icon: "📝" },
    { id: "completed" as TabType, label: "完了済み", icon: "✅" },
    { id: "drafts" as TabType, label: "下書き", icon: "📄" },
  ];

  const filteredBoards = boards.filter(board => {
    switch (activeTab) {
      case "active":
        return board.status === "active";
      case "completed":
        return board.status === "completed";
      case "drafts":
        return board.status === "draft";
      default:
        return false;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">進行中</span>;
      case "completed":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">完了</span>;
      case "draft":
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">下書き</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">ダッシュボード</h1>
        <p className="text-neutral-600">
          寄せ書きの管理とプロフィール設定を行えます。
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-neutral-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="space-y-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">プロフィール情報</h2>
              <div className="flex items-start gap-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="プロフィール"
                    className="h-16 w-16 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {session.user?.name || "未設定"}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    {session.user?.email}
                  </p>
                  <p className="text-sm text-neutral-500">
                    メンバー登録日: 2024年1月1日
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-brand mb-1">
                  {boards.filter(b => b.status === "active").length}
                </div>
                <div className="text-sm text-neutral-600">進行中の寄せ書き</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {boards.filter(b => b.status === "completed").length}
                </div>
                <div className="text-sm text-neutral-600">完了した寄せ書き</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-2xl font-bold text-neutral-600 mb-1">
                  {boards.reduce((sum, b) => sum + b.messageCount, 0)}
                </div>
                <div className="text-sm text-neutral-600">受け取ったメッセージ</div>
              </Card>
            </div>
          </div>
        )}

        {(activeTab === "active" || activeTab === "completed" || activeTab === "drafts") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900">
                {tabs.find(t => t.id === activeTab)?.label} ({filteredBoards.length}件)
              </h2>
              <Button 
                onClick={() => router.push("/new/paper")}
                variant="primary"
              >
                新しい寄せ書きを作成
              </Button>
            </div>

            {filteredBoards.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-neutral-500 mb-4">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  {activeTab === "active" && "進行中の寄せ書きがありません"}
                  {activeTab === "completed" && "完了した寄せ書きがありません"}
                  {activeTab === "drafts" && "下書きの寄せ書きがありません"}
                </h3>
                <p className="text-neutral-600 mb-4">
                  新しい寄せ書きを作成してみましょう！
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
                {filteredBoards.map((board) => (
                  <Card key={board.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {board.title}
                          </h3>
                          {getStatusBadge(board.status)}
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">
                          受取人: {board.recipientName}
                        </p>
                        <p className="text-sm text-neutral-600 mb-1">
                          メッセージ数: {board.messageCount}件
                        </p>
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
                          プレビュー
                        </Button>
                        <Button
                          onClick={() => handleEditBoard(board.id)}
                          variant="outline"
                          className="text-xs px-3 py-1"
                        >
                          編集
                        </Button>
                        {board.status === "completed" && (
                          <Button
                            onClick={() => handleDownloadPdf(board.id)}
                            variant="outline"
                            className="text-xs px-3 py-1"
                          >
                            PDF出力
                          </Button>
                        )}
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
        )}
      </div>
    </div>
  );
}