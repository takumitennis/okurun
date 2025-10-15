"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "サーバー設定エラーが発生しました。";
      case "AccessDenied":
        return "アクセスが拒否されました。";
      case "Verification":
        return "認証に失敗しました。";
      default:
        return "ログイン中にエラーが発生しました。";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
            ログインエラー
          </h2>
        </div>
        
        <Card className="p-8">
          <div className="space-y-6 text-center">
            <div className="text-red-600">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                エラーが発生しました
              </h3>
              <p className="text-sm text-neutral-600">
                {getErrorMessage(error)}
              </p>
            </div>
            
            <div className="space-y-3">
              <Link href="/auth/signin">
                <Button className="w-full" variant="primary">
                  再度ログインを試す
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="w-full" variant="outline">
                  ホームに戻る
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
