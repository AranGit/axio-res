'use client';

import { useState } from 'react';
import type { Result } from 'axio-res';
import type { AxioResError } from 'axio-res';
import {
  standardApi,
  ProductSchema,
  StrictProductSchema,
  type Product,
} from '@/lib/api';
import { ResultDisplay } from '../components/ResultDisplay';
import { CodeSnippet } from '../components/CodeSnippet';

export function CaseZodValidation() {
  const [result, setResult] = useState<Result<Product, AxioResError> | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'pass' | 'fail'>('pass');

  const handleFetch = async (validateMode: 'pass' | 'fail') => {
    setLoading(true);
    setResult(null);
    setMode(validateMode);

    const schema = validateMode === 'pass' ? ProductSchema : StrictProductSchema;

    const res = await standardApi.get<Product>('/products/1', { schema });

    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Case 2 — Zod Schema Validation{' '}
          <span className="text-white/30 font-normal text-lg">(Type Safety)</span>
        </h2>
        <p className="mt-2 text-white/40 max-w-2xl">
          Fetch <code className="text-indigo-400">/products/1</code> and validate with Zod.
          The &quot;Pass&quot; button uses a matching schema.
          The &quot;Fail&quot; button uses a strict schema requiring a{' '}
          <code className="text-red-400">nonExistentField</code>, which will fail validation.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleFetch('pass')}
          disabled={loading}
          className="btn-glow text-white disabled:opacity-50"
        >
          {loading && mode === 'pass' ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Validating…
            </span>
          ) : (
            '✅ Fetch + Validate (Pass)'
          )}
        </button>
        <button
          onClick={() => handleFetch('fail')}
          disabled={loading}
          className="btn-outline disabled:opacity-50"
        >
          {loading && mode === 'fail' ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Validating…
            </span>
          ) : (
            '❌ Fetch + Validate (Fail)'
          )}
        </button>
      </div>

      {/* Result */}
      {result && <ResultDisplay result={result} />}

      {/* Schema preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CodeSnippet
          title='ProductSchema (will pass ✅)'
          code={`const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  rating: z.number(),
  stock: z.number(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
});`}
        />
        <CodeSnippet
          title='StrictProductSchema (will fail ❌)'
          code={`const StrictProductSchema = ProductSchema.extend({
  nonExistentField: z.string(), // 💥 Does not exist
});

// ZodValidationError:
// {
//   type: 'ZOD_VALIDATION_ERROR',
//   issues: [{ code: 'invalid_type', ... }]
// }`}
        />
      </div>

      <CodeSnippet
        title="Usage"
        code={`const result = await api.get<Product>('/products/1', {
  schema: ProductSchema,  // ← Optional Zod schema
});

if (result.ok) {
  // result.value is fully validated Product
} else if (result.error.type === 'ZOD_VALIDATION_ERROR') {
  // Handle validation errors with full issue details
  console.log(result.error.issues);
}`}
      />
    </div>
  );
}
