'use client';

import { useState } from 'react';
import type { Result } from 'axio-res';
import type { AxioResError } from 'axio-res';
import { standardApi, UsersResponseSchema, type UsersResponse } from '@/lib/api';
import { ResultDisplay } from '../components/ResultDisplay';
import { CodeSnippet } from '../components/CodeSnippet';

export function CaseStandardFetch() {
  const [result, setResult] = useState<Result<UsersResponse, AxioResError> | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const handleFetch = async () => {
    setLoading(true);
    setResult(null);
    const start = performance.now();

    const res = await standardApi.get<UsersResponse>('/users?limit=5', {
      schema: UsersResponseSchema,
    });

    setElapsed(Math.round(performance.now() - start));
    setResult(res);
    setLoading(false);
  };

  const handleFetchError = async () => {
    setLoading(true);
    setResult(null);
    const start = performance.now();

    // Intentionally bad URL to trigger error
    const res = await standardApi.get<UsersResponse>('/this-does-not-exist');

    setElapsed(Math.round(performance.now() - start));
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Case 1 — Standard Fetch <span className="text-white/30 font-normal text-lg">(Result Monad)</span>
        </h2>
        <p className="mt-2 text-white/40 max-w-2xl">
          Fetch <code className="text-indigo-400">/users</code> from dummyjson.com. The response
          is wrapped in a <code className="text-indigo-400">Result&lt;T, E&gt;</code> — no try/catch needed.
          Click &quot;Trigger Error&quot; to see the error path.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={handleFetch} disabled={loading} className="btn-glow text-white disabled:opacity-50">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Fetching…
            </span>
          ) : (
            '📡 Fetch Users'
          )}
        </button>
        <button onClick={handleFetchError} disabled={loading} className="btn-outline disabled:opacity-50">
          ❌ Trigger Error
        </button>
        {elapsed > 0 && (
          <span className="text-xs text-white/30">{elapsed}ms</span>
        )}
      </div>

      {/* Result */}
      {result && <ResultDisplay result={result} />}

      {/* Code snippet */}
      <CodeSnippet
        title="How it works"
        code={`import { createAxioRes } from 'axio-res';

const api = createAxioRes({ baseURL: 'https://dummyjson.com' });

// ✅ No try/catch — result is always a Result<T, E>
const result = await api.get<UsersResponse>('/users?limit=5');

if (result.ok) {
  // TypeScript narrows: result.value is UsersResponse
  console.log(result.value.users);
} else {
  // TypeScript narrows: result.error is AxioResError
  console.error(result.error);
}`}
      />
    </div>
  );
}
