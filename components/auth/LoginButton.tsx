"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <Button variant="outline" disabled>
        読み込み中...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/me")}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="プロフィール"
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="text-sm text-neutral-700">
            {session.user?.name || session.user?.email}
          </span>
        </button>
        <Button 
          onClick={() => signOut()}
          variant="outline"
          className="text-xs px-3 py-1"
        >
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => router.push("/auth/signin")}
      variant="primary"
    >
      新規登録/ログイン
    </Button>
  );
}
