/**
 * @module types/result
 * Core Result Monad type — the foundation of axio-res.
 *
 * A discriminated union that forces callers to handle both
 * success and failure paths explicitly, eliminating try/catch boilerplate.
 */

// ────────────────────────────────────────────────────────────────
// Result<T, E> — Discriminated Union
// ────────────────────────────────────────────────────────────────

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

// ────────────────────────────────────────────────────────────────
// Constructors
// ────────────────────────────────────────────────────────────────

/** Wrap a successful value in a Result. */
export const ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

/** Wrap a failure in a Result. */
export const fail = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

// ────────────────────────────────────────────────────────────────
// Utilities — functional helpers for composing Results
// ────────────────────────────────────────────────────────────────

/** Map over the success value of a Result. */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (result.ok ? ok(fn(result.value)) : result);

/** FlatMap — chain Results together. */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (result.ok ? fn(result.value) : result);

/** Unwrap with a fallback value. */
export const unwrapOr = <T, E>(result: Result<T, E>, fallback: T): T =>
  result.ok ? result.value : fallback;

/** Pattern-match on a Result. */
export const match = <T, E, U>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => U; fail: (error: E) => U },
): U => (result.ok ? handlers.ok(result.value) : handlers.fail(result.error));
