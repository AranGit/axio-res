'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { CaseStandardFetch } from './cases/CaseStandardFetch';
import { CaseZodValidation } from './cases/CaseZodValidation';
import { CaseMocking } from './cases/CaseMocking';
import { CaseComparison } from './cases/CaseComparison';

const TABS = [
  { id: 'standard', label: 'Standard Fetch', icon: '📡' },
  { id: 'zod', label: 'Zod Validation', icon: '🛡️' },
  { id: 'mocking', label: 'Faker Mocking', icon: '🎭' },
  { id: 'comparison', label: 'Comparison', icon: '⚖️' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabId>('standard');

  const renderCase = useCallback(() => {
    switch (activeTab) {
      case 'standard':
        return <CaseStandardFetch />;
      case 'zod':
        return <CaseZodValidation />;
      case 'mocking':
        return <CaseMocking />;
      case 'comparison':
        return <CaseComparison />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-surface-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
              AR
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              axio-res
            </span>
            <span className="badge-info">Playground</span>
          </Link>

          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 transition-colors hover:text-white/60"
          >
            Powered by dummyjson.com
          </a>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <nav className="border-b border-white/[0.04] bg-surface-950/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl gap-1 px-6 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/[0.08] text-white shadow-lg shadow-indigo-500/5'
                  : 'text-white/40 hover:bg-white/[0.03] hover:text-white/70'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="animate-fade-in" key={activeTab}>
          {renderCase()}
        </div>
      </main>
    </div>
  );
}
