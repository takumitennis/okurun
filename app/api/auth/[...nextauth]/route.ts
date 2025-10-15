import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google認証成功時の処理
      console.log("Sign in successful:", user);
      return true;
    },
    async session({ session, token }) {
      // セッション情報をカスタマイズ
      return session;
    },
    async jwt({ token, account, user }) {
      // JWT トークンをカスタマイズ
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // カスタムサインインページ
    error: "/auth/error",   // エラーページ
  },
});

export { handler as GET, handler as POST };
