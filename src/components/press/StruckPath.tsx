'use client';

import { usePathname } from 'next/navigation';

/** The missing address, struck through in red pen with "404" written over it. */
export default function StruckPath() {
  const path = usePathname() ?? '';
  const shown = path.length > 42 ? `${path.slice(0, 40)}…` : path || '/this-page';
  return (
    <p className="struck-path">
      <span className="fix">
        <span className="old" aria-hidden="true">
          {shown}
        </span>
        <span className="caret" aria-hidden="true">
          &#x2038;
        </span>
        <span className="new">404</span>
      </span>
      <span className="sr-only-press">The address {path} was not found.</span>
    </p>
  );
}
