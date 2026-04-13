import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      {/* Ambient gradient blob */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Logo / Title */}
      <div className="relative animate-fade-in">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse-subtle" />
          v1.0.0 — Result Monad for Axios
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent leading-tight">
          axio-res
        </h1>

        <p className="mt-5 max-w-xl mx-auto text-lg text-white/50 leading-relaxed">
          Functional error handling for Axios. Zero try/catch, optional Zod
          validation, seamless mocking, and state sync — all in a pluggable
          monadic wrapper.
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative mt-10 flex flex-wrap justify-center gap-3 animate-slide-up">
        {[
          '🎯 Result Monad',
          '🔌 Plugin System',
          '🛡️ Zod Validation',
          '🎭 Dynamic Mocking',
          '🔄 State Sync',
          '⚛️ React Query Bridge',
        ].map((feature) => (
          <span
            key={feature}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-white/60 backdrop-blur-sm transition-colors hover:border-white/10 hover:text-white/80"
          >
            {feature}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="relative mt-12 flex items-center gap-4 animate-slide-up">
        <Link href="/playground" className="btn-glow text-white">
          Open Playground →
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          GitHub
        </a>
      </div>

      {/* Code preview */}
      <div className="relative mt-16 w-full max-w-2xl animate-slide-up">
        <div className="glass-card p-1">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <div className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-2 text-xs text-white/30 font-mono">example.ts</span>
          </div>
          <pre className="code-block m-0 rounded-t-none border-0 text-[13px] leading-7">
            <code>
              <span className="syntax-keyword">{'import'}</span>{' { createAxioRes } '}
              <span className="syntax-keyword">from</span>{' '}
              <span className="syntax-string">{`'axio-res'`}</span>
              {'\n\n'}
              <span className="syntax-keyword">const</span>{' '}
              <span className="syntax-const">api</span>
              {' = '}
              <span className="syntax-fn">createAxioRes</span>
              {'({ '}
              <span className="syntax-const">baseURL</span>
              {': '}
              <span className="syntax-string">{`'https://api.example.com'`}</span>
              {' })\n\n'}
              <span className="syntax-keyword">const</span>{' '}
              <span className="syntax-const">result</span>
              {' = '}
              <span className="syntax-keyword">await</span>{' '}
              <span className="syntax-const">api</span>
              {'.'}
              <span className="syntax-fn">get</span>
              {'<'}
              <span className="syntax-type">User[]</span>
              {'>('}
              <span className="syntax-string">{`'/users'`}</span>
              {')\n\n'}
              <span className="syntax-keyword">if</span>
              {' ('}
              <span className="syntax-const">result</span>
              {'.ok) {\n  '}
              <span className="syntax-comment">{'// ✅ TypeScript knows `result.value` is User[]'}</span>
              {'\n  console.log('}
              <span className="syntax-const">result</span>
              {'.value)\n} '}
              <span className="syntax-keyword">else</span>
              {' {\n  '}
              <span className="syntax-comment">{'// ❌ TypeScript knows `result.error` is AxioResError'}</span>
              {'\n  console.error('}
              <span className="syntax-const">result</span>
              {'.error)\n}'}
            </code>
          </pre>
        </div>
      </div>
    </main>
  );
}
