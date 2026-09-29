import Link from 'next/link';
import { masthead, socialLinks } from '@/content/home.config';
import NameSeen from './NameSeen';

export default function Masthead({ issueNumber }: { issueNumber: number }) {
  return (
    <header className="masthead">
      <h1>
        Opeyemi{' '}
        <span className="fix">
          <span className="old" aria-hidden="true">
            Stephen
          </span>
          <span className="caret" aria-hidden="true">
            &#x2038;
          </span>
          <span className="new">Bangkok</span>
        </span>
      </h1>
      <NameSeen />
      <p className="role">{masthead.role}</p>
      <div className="issue">
        <span>{masthead.edition}</span>
        <span>No. {issueNumber}</span>
        <span>
          {masthead.topics.map(({ label, topic }) => (
            <Link key={topic} href={`/blog?topic=${topic}`} className="chip">
              {label}
            </Link>
          ))}
        </span>
      </div>
      <div className="socials">
        {socialLinks.map(({ label, href }, i) => (
          <span key={label} style={{ display: 'contents' }}>
            {i > 0 && <span className="sep" aria-hidden="true">/</span>}
            <a href={href} rel={href.startsWith('http') ? 'me noopener' : undefined}>
              {label}
            </a>
          </span>
        ))}
      </div>
    </header>
  );
}
