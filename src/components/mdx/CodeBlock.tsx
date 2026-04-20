'use client';

import React, { useState, useRef } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

export default function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const language = className ? className.replace('language-', '') : '';

  const copyToClipboard = () => {
    if (codeRef.current) {
      const code = codeRef.current.textContent || '';
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-8">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-md bg-primary/20 hover:bg-primary/30 transition-colors text-white"
          aria-label="Copy code to clipboard"
        >
          {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
        </button>
      </div>

      {language && (
        <div className="absolute left-0 top-0 px-3 py-1 text-xs font-mono text-white bg-gray-700 rounded-br-md z-10">
          {language}
        </div>
      )}

      <pre className="rounded-lg overflow-x-auto p-6 pt-10 bg-[#1e293b] text-white border border-gray-700 shadow-lg">
        <code ref={codeRef} className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}
