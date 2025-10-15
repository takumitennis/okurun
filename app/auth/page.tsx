"use client";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    alert("デモ: メール登録はダミーです。バックエンド接続で実装してください。");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-800 mb-4">新規登録 / ログイン</h1>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-neutral-600">Googleで続行</div>
            <Button className="w-full py-3" onClick={() => alert("デモ: Google認証は未連携です。NextAuth/Supabase/Firebase等を接続してください。")}>Googleで続行</Button>
          </div>

          <div className="border-t border-neutral-200 my-2" />

          <form className="space-y-3" onSubmit={submitEmail}>
            <div>
              <label className="block text-sm text-neutral-700 mb-1">メールアドレス</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-700 mb-1">パスワード</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              />
            </div>
            <Button type="submit" className="w-full py-2">メールで登録/ログイン</Button>
          </form>
        </Card>
      </div>

      <div className="text-sm text-neutral-600">
        <h2 className="text-neutral-800 font-semibold mb-2">実装メモ</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>Google認証は NextAuth.js v5 または Supabase Auth/Firebase Auth を接続してください。</li>
          <li>メール登録はメールリンク認証（Magic Link）を推奨。サーバー側のエンドポイントで処理します。</li>
          <li>ログイン状態で <code>/me</code> へ遷移し、管理画面を表示します。</li>
        </ul>
      </div>
    </div>
  );
}


