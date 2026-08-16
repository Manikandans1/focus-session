import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-line bg-canvas/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
        >
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-full bg-primary"
          />
          Focus Session
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-5 text-sm font-medium">
          <Link href="/select" className="hidden sm:inline text-inkSoft hover:text-primary">
            Start a session
          </Link>
          <Link href="/about" className="text-inkSoft hover:text-primary">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
