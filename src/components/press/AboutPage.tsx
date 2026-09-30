import Image from 'next/image';
import { experience, intro, lanes, principles, skills, story } from '@/content/about.config';
import { contactEmail, now, socialLinks } from '@/content/home.config';
import NowTicker from './NowTicker';
import PressFooter from './PressFooter';

export default function AboutPage() {
  return (
    <>
      <header className="profile">
        <figure className="portrait">
          <Image
            src="/images/about/opeyemi-portrait.jpg"
            alt="Opeyemi Bangkok, in a black T-shirt and rimless glasses, smiling at the camera"
            width={1122}
            height={1402}
            priority
            sizes="(max-width: 820px) 100vw, 380px"
          />
        </figure>
        <div className="profile-text">
          <h1>
            Opeyemi <span className="accent">Bangkok</span>
          </h1>
          <p className="profile-tagline">{intro.tagline}</p>
          <p className="profile-bio">{intro.bio}</p>
          <div className="profile-actions">
            <a href={`mailto:${contactEmail}`} className="cta">
              Email me <span aria-hidden="true">&rarr;</span>
            </a>
            <span className="profile-links">
              {socialLinks
                .filter((l) => !l.href.startsWith('mailto:'))
                .map((l) => (
                  <a key={l.label} href={l.href} rel="me noopener">
                    {l.label}
                  </a>
                ))}
            </span>
          </div>
        </div>
      </header>

      <NowTicker items={now} />

      <article className="story" aria-labelledby="story-heading">
        <h2 id="story-heading">{story.title}</h2>
        <div className="story-body">
          {story.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </article>

      <section className="record" aria-labelledby="record-heading">
        <h2 id="record-heading">
          The record <span className="chip">2023 to now</span>
        </h2>
        {lanes.map((lane) => {
          const roles = experience.filter((r) => r.lane === lane.id);
          if (roles.length === 0) return null;
          return (
            <div key={lane.id} className="lane">
              <h3>{lane.label}</h3>
              <ol>
                {roles.map((role) => (
                  <li key={`${role.company}-${role.role}`}>
                    <span className="year">
                      {role.period}
                      {role.current && <span className="chip now">Now</span>}
                    </span>
                    <div>
                      <h4>{role.role}</h4>
                      <p className="company">{role.company}</p>
                      <ul>
                        {role.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </section>

      <section className="principles" aria-labelledby="principles-heading">
        <h2 id="principles-heading">Principles</h2>
        <ol>
          {principles.map((p) => (
            <li key={p.title}>
              <strong>{p.title}</strong>
              <span>{p.desc}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="index" aria-labelledby="index-heading">
        <h2 id="index-heading">Index</h2>
        <div className="index-cols">
          {skills.map((group) => (
            <div key={group.group}>
              <h3>{group.group}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Let’s make magic</h2>
        <p>Have a project or idea? I’m open to collaborations and impactful work.</p>
        <div className="contact-actions">
          <a href={`mailto:${contactEmail}`} className="cta">
            Email me <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <PressFooter to="archive" />
    </>
  );
}
