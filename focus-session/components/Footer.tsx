import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="mx-auto max-w-5xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} Focus Session. Built for focused watching.</p>
        <nav aria-label="Legal" className="flex items-center gap-5">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary">
            Terms
          </Link>
          <a href="mailto:hello@focussession.app" className="hover:text-primary">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
