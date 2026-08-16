import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why Focus Session exists and how it works.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 prose-none">
      <h1 className="font-display text-3xl font-semibold text-ink">About Focus Session</h1>
      <p className="mt-6 text-inkSoft leading-relaxed">
        Most people open YouTube without knowing exactly what they want to watch, and end up
        scrolling far longer than they meant to. Focus Session flips the question. Instead of
        &quot;what do you want to watch?&quot;, we ask what you actually need right now, what
        format you&apos;re in the mood for, and how much time you have.
      </p>
      <p className="mt-4 text-inkSoft leading-relaxed">
        From there, we search YouTube on your behalf, pick a small set of videos or Shorts that
        fit the time you gave us, and let you watch them right here using YouTube&apos;s own
        supported embedded player. No downloads, no rehosting, no endless feed.
      </p>
      <h2 className="font-display text-xl font-semibold text-ink mt-10">How we make money</h2>
      <p className="mt-4 text-inkSoft leading-relaxed">
        Focus Session is supported by standard, clearly labeled advertising. We don&apos;t
        manipulate ad placement, encourage clicks, or generate artificial traffic — the product
        has to be genuinely useful first.
      </p>
      <h2 className="font-display text-xl font-semibold text-ink mt-10">What this is not</h2>
      <p className="mt-4 text-inkSoft leading-relaxed">
        This is not a YouTube replacement, and it&apos;s not trying to keep you here longer than
        you planned. A session ends when your time is up.
      </p>
    </div>
  );
}
