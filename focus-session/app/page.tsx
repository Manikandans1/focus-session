import Link from 'next/link';
import AdPlaceholder from '@/components/AdPlaceholder';

export default function HomePage() {
  const steps = [
    { n: '01', title: 'What do you need?', copy: 'Pick a goal — coding, career, news, or just to relax.' },
    { n: '02', title: 'What do you want to watch?', copy: 'Videos, Shorts, or a mix of both.' },
    { n: '03', title: 'How much time do you have?', copy: '5, 10, 20, or 30 minutes. We build the session to fit.' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center py-16 sm:py-24">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.1] text-ink">
            Stop scrolling.
            <br />
            <span className="italic text-primary">Start watching</span> with purpose.
          </h1>
          <p className="mt-6 text-lg text-inkSoft max-w-md">
            Tell us what you need right now. We&apos;ll find useful content for the time you have.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/select" className="btn-primary">
              Get Started
            </Link>
            <span className="text-sm text-muted">No account needed.</span>
          </div>
        </div>

        {/* Signature element: a segmented session ring — goal, format, and
            time are the three inputs that build every session, so the
            dial is literally divided into three. */}
        <div className="flex justify-center">
          <SessionDial />
        </div>
      </section>

      <section aria-labelledby="how-it-works" className="py-16 border-t border-line">
        <h2 id="how-it-works" className="font-display text-2xl font-semibold text-ink mb-10">
          Three questions. One focused session.
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="font-mono text-sm text-primary">{s.n}</span>
              <h3 className="font-display text-lg font-semibold text-ink mt-2">{s.title}</h3>
              <p className="text-sm text-inkSoft mt-2">{s.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-12">
        <AdPlaceholder variant="banner" />
      </section>
    </div>
  );
}

function SessionDial() {
  return (
    <svg width="260" height="260" viewBox="0 0 260 260" role="img" aria-label="A dial divided into goal, format, and time">
      <circle cx="130" cy="130" r="110" fill="none" stroke="#DBE2DF" strokeWidth="2" />
      <circle
        cx="130"
        cy="130"
        r="96"
        fill="none"
        stroke="#0F766E"
        strokeWidth="14"
        strokeDasharray="167 335"
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 130 130)"
      />
      <circle
        cx="130"
        cy="130"
        r="96"
        fill="none"
        stroke="#F5A623"
        strokeWidth="14"
        strokeDasharray="100 335"
        strokeDashoffset="-177"
        strokeLinecap="round"
        transform="rotate(-90 130 130)"
      />
      <circle
        cx="130"
        cy="130"
        r="96"
        fill="none"
        stroke="#10201D"
        strokeWidth="14"
        strokeDasharray="50 335"
        strokeDashoffset="-287"
        strokeLinecap="round"
        transform="rotate(-90 130 130)"
        opacity="0.85"
      />
      <text x="130" y="122" textAnchor="middle" className="fill-ink" fontFamily="var(--font-display)" fontSize="20" fontWeight="600">
        20 min
      </text>
      <text x="130" y="144" textAnchor="middle" className="fill-muted" fontFamily="var(--font-body)" fontSize="12">
        one focused session
      </text>
    </svg>
  );
}
