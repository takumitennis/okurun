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
        <span className="text-sm text-neutral-700">
          {session.user?.name || session.user?.email}
        </span>
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
