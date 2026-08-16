import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Focus Session handles data.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="mt-8 space-y-6 text-inkSoft leading-relaxed">
        <p>
          Focus Session (&quot;we&quot;, &quot;us&quot;) does not require an account, and V1 does
          not use a database. Here is what actually happens with your data.
        </p>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">What we store</h2>
          <p className="mt-2">
            Your goal, content type, and time selections are kept in your browser (session
            storage and the page URL) so the app can build your session. This data is not sent
            to a database and is cleared when you close your browser tab or start a new session.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">YouTube</h2>
          <p className="mt-2">
            Video search and metadata are retrieved from the official YouTube Data API.
            Playback happens through YouTube&apos;s own embedded player, which is subject to
            Google&apos;s Privacy Policy and YouTube&apos;s Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Advertising</h2>
          <p className="mt-2">
            We intend to display advertising (for example, Google AdSense) to support the site.
            Ad providers may use cookies or similar technologies as described in their own
            privacy policies. We do not control or see the data those providers collect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Feedback buttons</h2>
          <p className="mt-2">
            The 👍 / 👎 / Skip buttons on the feed page are stored locally in your session only,
            for your own reference during that session. They are not sent to a server in V1.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{' '}
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
