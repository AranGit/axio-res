'use client';

import { useState } from 'react';

interface CodeSnippetProps {
  title: string;
  code: string;
}

export function CodeSnippet({ title, code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-white/30 font-mono ml-1">{title}</span>
        </div>

        <button
          onClick={handleCopy}
          className="rounded-md px-2.5 py-1 text-[11px] text-white/30 transition-all hover:bg-white/[0.05] hover:text-white/60"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre className="code-block m-0 rounded-t-none border-0 text-[12px] leading-6">
        <code className="text-white/60">{code}</code>
      </pre>
    </div>
  );
}
