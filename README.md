This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy (.dev)

This repo is prepared for Vercel Preview → Production with `.dev` domains.

### 1) Import to Vercel
- Push to GitHub, then Vercel → New Project → Import repo (Next.js auto-detected)
- Default build (Node 20 / Turbopack)
- Preview URL will be `*.vercel.app`

### 2) Domains
- Start with `*.vercel.app` (Preview)
- When ready: add domains to Vercel → Domains
  - Preview: `dev.okurun.dev`
  - Production: `okurun.dev`
- DNS: create CNAME records
  - `dev.okurun.dev` → `cname.vercel-dns.com`
  - `okurun.dev` → `cname.vercel-dns.com`
  - .dev is HTTPS-only (HSTS); use SSL in Vercel (default)

### 3) Env Vars (Vercel → Settings → Environment Variables)
Create the following for Preview & Production (no secrets committed):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 4) Firebase Authentication – Authorized domains
- Add: `dev.okurun.dev`, `okurun.dev`, `*.vercel.app`
- OAuth Redirect URIs (if used):
  - https://dev.okurun.dev/api/auth/callback/google
  - https://okurun.dev/api/auth/callback/google

### 5) Images and CORS
- Prefer same-origin images for html2canvas.
- If serving from Firebase Storage, set CORS as shown in `cors.json` then run:

```
gsutil cors set cors.json gs://<YOUR_FIREBASE_STORAGE_BUCKET>
gsutil cors get gs://<YOUR_FIREBASE_STORAGE_BUCKET>
```

### 6) Local build

```
npm i
npm run build
npm start
```

Ensure routes render: `/`, `/designs`, `/new/paper`, `/new/message`, `/new/card`, `/share/<id>`, `/b/<id>`.

### UI note
- Message card components should keep outer margins minimal (0–6px). We will tune later.
