'use client';

import type { Result } from 'axio-res';
import type { AxioResError, ZodValidationError } from 'axio-res';

interface ResultDisplayProps {
  result: Result<unknown, AxioResError>;
}

const isZodError = (err: AxioResError): err is ZodValidationError =>
  typeof err === 'object' && err !== null && 'type' in err && err.type === 'ZOD_VALIDATION_ERROR';

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (result.ok) {
    return (
      <div className="glass-card animate-slide-up overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-3">
          <span className="badge-success">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            result.ok = true
          </span>
          <span className="text-xs text-white/20">Discriminated Union → Success Branch</span>
        </div>
        <div className="p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">
            result.value
          </p>
          <pre className="code-block max-h-96 overflow-auto text-xs leading-relaxed text-emerald-300/80">
            {JSON.stringify(result.value, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  // Error path
  const error = result.error;

  return (
    <div className="glass-card animate-slide-up overflow-hidden border-red-500/10">
      <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-3">
        <span className="badge-error">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400" />
          result.ok = false
        </span>
        <span className="text-xs text-white/20">Discriminated Union → Error Branch</span>
      </div>
      <div className="p-5">
        {isZodError(error) ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="badge-warning">ZOD_VALIDATION_ERROR</span>
              <span className="text-xs text-white/30">{error.issues.length} issue(s)</span>
            </div>
            <p className="mb-4 text-sm text-red-400/80 font-mono">{error.message}</p>
            <div className="space-y-2">
              {error.issues.map((issue, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-red-500/10 bg-red-500/5 p-3 text-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-red-400">
                      {issue.code}
                    </span>
                    <span className="text-white/30">
                      at path: [{issue.path.join(' → ')}]
                    </span>
                  </div>
                  <p className="text-white/50">{issue.message}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-white/30">
              result.error
            </p>
            <pre className="code-block max-h-60 overflow-auto text-xs leading-relaxed text-red-300/80">
              {JSON.stringify(
                {
                  message: 'message' in error ? error.message : String(error),
                  status: 'status' in error ? error.status : undefined,
                  code: 'code' in error ? error.code : undefined,
                },
                null,
                2,
              )}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
