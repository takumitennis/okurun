import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-10">
      <div className="border-t border-neutral-200 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 py-8 grid gap-2 sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-700">© {new Date().getFullYear()} OKURUN</p>
          <div className="flex gap-3 text-sm">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-brand-dark">X</a>
            <a href="https://line.me" target="_blank" rel="noreferrer" className="hover:text-brand-dark">LINE</a>
          </div>
        </div>
      </div>
      <div className="h-3 bg-pink-200/70"></div>
    </footer>
  );
}


