'use client';

import { useState } from 'react';
import axios from 'axios';
import { standardApi, UsersResponseSchema, type UsersResponse } from '@/lib/api';

const BASE_URL = 'https://dummyjson.com';

interface PanelResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: unknown;
  error?: string;
  elapsed?: number;
  lines: number;
}

export function CaseComparison() {
  const [vanilla, setVanilla] = useState<PanelResult>({ status: 'idle', lines: 0 });
  const [axioRes, setAxioRes] = useState<PanelResult>({ status: 'idle', lines: 0 });

  // ── Vanilla Axios (traditional try/catch) ──
  const fetchVanilla = async () => {
    setVanilla({ status: 'loading', lines: 0 });
    const start = performance.now();

    try {
      const response = await axios.get(`${BASE_URL}/users?limit=3`);
      const elapsed = Math.round(performance.now() - start);
      setVanilla({
        status: 'success',
        data: response.data,
        elapsed,
        lines: 11,
      });
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - start);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setVanilla({
        status: 'error',
        error: msg,
        elapsed,
        lines: 11,
      });
    }
  };

  // ── axio-res (Result Monad) ──
  const fetchAxioRes = async () => {
    setAxioRes({ status: 'loading', lines: 0 });
    const start = performance.now();

    const result = await standardApi.get<UsersResponse>('/users?limit=3', {
      schema: UsersResponseSchema,
    });
    const elapsed = Math.round(performance.now() - start);

    if (result.ok) {
      setAxioRes({
        status: 'success',
        data: result.value,
        elapsed,
        lines: 6,
      });
    } else {
      setAxioRes({
        status: 'error',
        error: 'type' in result.error
          ? result.error.message
          : result.error.message,
        elapsed,
        lines: 6,
      });
    }
  };

  const fetchBoth = () => {
    fetchVanilla();
    fetchAxioRes();
  };

  // ── Vanilla Error ──
  const fetchBothError = async () => {
    setVanilla({ status: 'loading', lines: 0 });
    setAxioRes({ status: 'loading', lines: 0 });

    const start1 = performance.now();
    try {
      await axios.get(`${BASE_URL}/this-does-not-exist`);
      setVanilla({ status: 'success', data: {}, elapsed: Math.round(performance.now() - start1), lines: 11 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setVanilla({ status: 'error', error: msg, elapsed: Math.round(performance.now() - start1), lines: 11 });
    }

    const start2 = performance.now();
    const result = await standardApi.get<UsersResponse>('/this-does-not-exist');
    const elapsed2 = Math.round(performance.now() - start2);
    if (result.ok) {
      setAxioRes({ status: 'success', data: result.value, elapsed: elapsed2, lines: 6 });
    } else {
      setAxioRes({
        status: 'error',
        error: 'type' in result.error ? result.error.message : result.error.message,
        elapsed: elapsed2,
        lines: 6,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Case 4 — Side-by-Side Comparison
        </h2>
        <p className="mt-2 text-white/40 max-w-2xl">
          Compare Vanilla Axios + try/catch vs axio-res + Result Monad for the
          same API call. Notice the code reduction and type safety improvements.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={fetchBoth} className="btn-glow text-white">
          ⚡ Fetch Both (Success)
        </button>
        <button onClick={fetchBothError} className="btn-outline">
          💥 Fetch Both (Error)
        </button>
      </div>

      {/* Side-by-side */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vanilla panel */}
        <ComparisonPanel
          title="Vanilla Axios + Try/Catch"
          subtitle="Traditional approach"
          accentColor="amber"
          status={vanilla.status}
          data={vanilla.data}
          error={vanilla.error}
          elapsed={vanilla.elapsed}
          code={`// Vanilla Axios — 11 lines, manual error handling
try {
  const response = await axios.get(
    'https://dummyjson.com/users?limit=3'
  );
  // ⚠️ response.data is 'any' — no type safety
  setData(response.data);
} catch (err) {
  // ⚠️ err is 'unknown' — must cast manually
  const msg = err instanceof Error 
    ? err.message : 'Unknown error';
  setError(msg);
}`}
        />

        {/* axio-res panel */}
        <ComparisonPanel
          title="axio-res + Result Monad"
          subtitle="Functional approach"
          accentColor="indigo"
          status={axioRes.status}
          data={axioRes.data}
          error={axioRes.error}
          elapsed={axioRes.elapsed}
          code={`// axio-res — 6 lines, fully typed
const result = await api.get<UsersResponse>(
  '/users?limit=3',
  { schema: UsersResponseSchema }
);
// ✅ Discriminated union — no try/catch
if (result.ok) {
  setData(result.value); // ← UsersResponse
} else {
  setError(result.error); // ← AxioResError  
}`}
          recommended
        />
      </div>

      {/* Summary comparison table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="p-4 text-left text-white/40 font-medium">Feature</th>
              <th className="p-4 text-center text-amber-400/80 font-medium">Vanilla Axios</th>
              <th className="p-4 text-center text-indigo-400 font-medium">axio-res</th>
            </tr>
          </thead>
          <tbody className="text-white/60">
            {[
              ['Error handling', 'try/catch (manual)', 'Result<T, E> (automatic)'],
              ['Type safety', 'any (unsafe)', 'Discriminated Union (safe)'],
              ['Runtime validation', '❌ None', '✅ Optional Zod'],
              ['Code lines (avg)', '~11 lines', '~6 lines'],
              ['Mocking support', '❌ Needs mock library', '✅ Built-in plugin'],
              ['State sync', '❌ Manual', '✅ Built-in plugin'],
            ].map(([feature, vanilla, axioRes]) => (
              <tr key={feature} className="border-b border-white/[0.02] last:border-0">
                <td className="p-4 font-medium text-white/70">{feature}</td>
                <td className="p-4 text-center">{vanilla}</td>
                <td className="p-4 text-center text-emerald-400/80">{axioRes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Sub-component: ComparisonPanel
// ────────────────────────────────────────────────

function ComparisonPanel({
  title,
  subtitle,
  accentColor,
  status,
  data,
  error,
  elapsed,
  code,
  recommended,
}: {
  title: string;
  subtitle: string;
  accentColor: 'amber' | 'indigo';
  status: PanelResult['status'];
  data?: unknown;
  error?: string;
  elapsed?: number;
  code: string;
  recommended?: boolean;
}) {
  const borderClassMap = {
    amber: 'border-amber-500/20',
    indigo: 'border-indigo-500/30',
  };

  return (
    <div className={`glass-card relative overflow-hidden ${recommended ? borderClassMap[accentColor] : ''}`}>
      {recommended && (
        <div className="absolute top-0 right-0 rounded-bl-xl bg-indigo-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
          Recommended
        </div>
      )}

      <div className="p-5 border-b border-white/[0.04]">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>
      </div>

      {/* Code */}
      <pre className="code-block m-0 rounded-none border-x-0 text-[12px] leading-6">
        <code className="text-white/70">{code}</code>
      </pre>

      {/* Result */}
      <div className="p-5 border-t border-white/[0.04] min-h-[100px]">
        {status === 'idle' && (
          <p className="text-sm text-white/20 italic">Click a button above to see results…</p>
        )}
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-white/40">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            Fetching…
          </div>
        )}
        {status === 'success' && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="badge-success">✓ Success</span>
              {elapsed !== undefined && <span className="text-xs text-white/30">{elapsed}ms</span>}
            </div>
            <pre className="text-xs text-white/50 overflow-auto max-h-40 leading-relaxed">
              {JSON.stringify(data, null, 2)?.slice(0, 600)}
              {JSON.stringify(data, null, 2)?.length && JSON.stringify(data, null, 2).length > 600 ? '\n...' : ''}
            </pre>
          </div>
        )}
        {status === 'error' && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="badge-error">✗ Error</span>
              {elapsed !== undefined && <span className="text-xs text-white/30">{elapsed}ms</span>}
            </div>
            <p className="text-sm text-red-400/80 font-mono">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
