"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "./ui/Button";
import LoginButton from "./auth/LoginButton";

const navItems = [
  { href: "/new/paper", label: "作成する" },
  { href: "/#features", label: "OKURUNの特徴" },
  { href: "/howto", label: "使い方" },
  { href: "/designs", label: "デザイン" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Okurun (2).jpeg" alt="OKURUN" className="h-6 w-auto" />
        </Link>

        <button
          aria-label="メニュー"
          className="ml-auto md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-neutral-300 text-neutral-800 hover:bg-neutral-100"
          onClick={() => setOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M3.75 6.75A.75.75 0 014.5 6h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75zm.75 4.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5h-15z" clipRule="evenodd" />
          </svg>
        </button>

        <nav className="hidden md:flex ml-auto items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-2xl text-sm font-medium text-neutral-800 hover:text-brand-dark hover:bg-neutral-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-2">
            <LoginButton />
          </div>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-xl text-neutral-900 hover:bg-neutral-100 hover:text-brand-dark"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2" onClick={() => setOpen(false)}>
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


