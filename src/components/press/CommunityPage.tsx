import { contactEmail } from '@/content/home.config';
import PressFooter from './PressFooter';

interface Ad {
  kind: string;
  body: string;
  action?: { label: string; href: string };
  size?: 'wide' | 'full';
}

// Draft copy, pending the copy pass. Jokes are marked as jokes by their tone, not by claims.
const ADS: Ad[] = [
  {
    kind: 'Wanted',
    body: 'Student builders who ship. Africa-based, Solana-curious, allergic to demo-day vapourware.',
    action: { label: 'Inquire within', href: `mailto:${contactEmail}?subject=Builders` },
    size: 'wide',
  },
  {
    kind: 'Lost',
    body: 'One semicolon. Last seen in production on a Friday. If found, do not deploy.',
  },
  {
    kind: 'Notice',
    body: 'Meetups, study circles and office hours will be listed here once they are on the calendar.',
  },
  {
    kind: 'Collaborations',
    body: 'Have a project or idea? I’m open to collaborations and impactful work.',
    action: { label: 'Email me', href: `mailto:${contactEmail}` },
  },
  {
    kind: 'Found',
    body: 'A great many tabs. Owner reports they are all important.',
  },
  {
    kind: 'First copy',
    body: 'Want to hear the day this page goes to press? Send a note and you’ll be the first to know.',
    action: { label: 'Send a note', href: `mailto:${contactEmail}?subject=Community%20page` },
    size: 'full',
  },
];

export default function CommunityPage() {
  return (
    <>
      <header className="archive-head classifieds-head">
        <span className="stamp in-press" aria-hidden="true">
          In press
        </span>
        <h1>Classifieds</h1>
        <p>The community section is still at the printer. Until it&rsquo;s typeset, here&rsquo;s the notice board.</p>
      </header>

      <section className="classifieds" aria-label="Notice board">
        {ADS.map((ad) => (
          <article key={ad.kind} className={`ad${ad.size ? ` ad-${ad.size}` : ''}`}>
            <h2>{ad.kind}</h2>
            <p>{ad.body}</p>
            {ad.action ? (
              <a href={ad.action.href} className="ad-action">
                <span className="hl-swipe">{ad.action.label}</span> <span aria-hidden="true">&rarr;</span>
              </a>
            ) : null}
          </article>
        ))}
      </section>

      <PressFooter to="archive" />
    </>
  );
}
