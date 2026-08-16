import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using Focus Session.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="mt-8 space-y-6 text-inkSoft leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Using Focus Session</h2>
          <p className="mt-2">
            Focus Session helps you build a short, focused YouTube watch session based on a
            goal, a content type, and a time budget you choose. It is provided &quot;as is&quot;,
            without warranties of any kind.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Third-party content</h2>
          <p className="mt-2">
            All videos shown are hosted and served by YouTube, and displayed here through
            YouTube&apos;s official embedded player. We do not own, download, rehost, or modify
            this content. Your use of embedded videos is also subject to YouTube&apos;s Terms of
            Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Acceptable use</h2>
          <p className="mt-2">
            You agree not to misuse the service — for example, by attempting to scrape it,
            automate artificial traffic or ad interactions, or interfere with its normal
            operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Advertising</h2>
          <p className="mt-2">
            Focus Session may be supported by advertising. Interacting with ads is entirely
            optional and never required to use the product.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Changes</h2>
          <p className="mt-2">
            We may update these terms as the product evolves. Continued use of the site after a
            change means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions can be sent to{' '}
            <a href="mailto:hello@focussession.app" className="text-primary underline">
              hello@focussession.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
