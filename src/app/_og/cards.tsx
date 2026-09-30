import { OG } from './fonts';

function Strip({ left, right }: { left: string; right: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `2px solid ${OG.ink}`,
        paddingTop: 16,
        fontFamily: 'DisplayHead',
        fontSize: 22,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: OG.ink,
      }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

/** Site card: the masthead, with Stephen struck through and Bangkok written in. */
export function SiteCard({ issue }: { issue: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: OG.paper,
        padding: '48px 64px 52px',
        borderTop: `14px solid ${OG.ink}`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', fontFamily: 'Display', fontSize: 138, lineHeight: 0.9, color: OG.ink }}>
          <span style={{ textTransform: 'uppercase' }}>Opeyemi</span>
          <span style={{ width: 28 }} />
          <div style={{ display: 'flex', position: 'relative' }}>
            <span style={{ textTransform: 'uppercase', color: '#a7a8a5' }}>Stephen</span>
            <div style={{ position: 'absolute', left: -8, right: -8, top: 68, height: 10, background: OG.pen, borderRadius: 3 }} />
            <span
              style={{
                position: 'absolute',
                top: -54,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Serif',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 64,
                color: OG.pen,
                transform: 'rotate(-3deg)',
              }}
            >
              Bangkok
            </span>
          </div>
        </div>
        <p
          style={{
            fontFamily: 'Serif',
            fontSize: 34,
            lineHeight: 1.35,
            color: OG.ink,
            textAlign: 'center',
            maxWidth: 900,
            marginTop: 34,
          }}
        >
          Web3 infrastructure, African fintech and developer education, read from the receipts up.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          {['Web3', 'Fintech', 'Developer education'].map((t) => (
            <span
              key={t}
              style={{
                background: OG.hl,
                color: OG.ink,
                fontFamily: 'DisplayHead',
                fontSize: 22,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                padding: '4px 12px',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <Strip left={`Lagos edition · No. ${issue}`} right="opeyemibangkok.com" />
      </div>
    </div>
  );
}

/** Shorten at a word boundary so a line never ends mid-word. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  const trimmed = (space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,;:.\u2013-]+$/, '');
  return `${trimmed}…`;
}

/** Article card: type label, headline, dek and the dateline. */
export function ArticleCard({
  title,
  excerpt,
  kind,
  date,
  minutes,
}: {
  title: string;
  excerpt: string;
  kind: string;
  date: string;
  minutes?: number;
}) {
  const headline = clip(title, 110);
  const size = headline.length > 80 ? 60 : headline.length > 50 ? 72 : 88;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: OG.paper,
        padding: '40px 64px 48px',
        borderTop: `14px solid ${OG.ink}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Display', fontSize: 34, letterSpacing: 1, textTransform: 'uppercase', color: OG.ink }}>
          Opeyemi Bangkok
        </span>
        <span
          style={{
            background: OG.hl,
            color: OG.ink,
            fontFamily: 'DisplayHead',
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
            padding: '6px 14px',
          }}
        >
          {kind}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontFamily: 'DisplayHead', fontSize: size, lineHeight: 1.02, color: OG.ink, display: 'flex' }}>{headline}</div>
        <div style={{ fontFamily: 'Serif', fontSize: 28, lineHeight: 1.4, color: OG.muted, display: 'flex' }}>{clip(excerpt, 150)}</div>
      </div>
      <Strip left={`${date}${minutes ? ` · ${minutes} min read` : ''}`} right="opeyemibangkok.com" />
    </div>
  );
}
