'use client';

import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Code block with a language label and a copy button that is always reachable by keyboard and touch. */
export default function PressCodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const language = className?.match(/language-([\w-]+)/)?.[1] ?? '';

  const copy = async () => {
    const text = codeRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked (insecure context or permissions): leave the button as it was */
    }
  };

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        {language ? <span className="codeblock-lang">{language}</span> : <span />}
        <button type="button" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre tabIndex={0} role="region" aria-label={language ? `${language} code` : 'Code'}>
        <code ref={codeRef} className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}
