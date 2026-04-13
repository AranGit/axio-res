/**
 * axio-res — A Result Monad wrapper for Axios.
 *
 * Provides functional error handling, optional Zod validation,
 * mocking, and state sync for any React/Next.js project.
 *
 * @packageDocumentation
 */

// ── Core ──
export { createAxioRes } from './core';
export type { AxioResInstance } from './core';

// ── Types ──
export type {
  Result,
  AxioResConfig,
  AxioResPlugins,
  AxioResRequestOptions,
  MockPluginConfig,
  StateSyncPluginConfig,
  AxioResError,
  ZodValidationError,
} from './types';

// ── Helpers ──
export {
  ok,
  fail,
  map,
  flatMap,
  unwrapOr,
  match,
} from './types';

// ── React (tree-shaken if not used) ──
export { useAxioResQuery } from './react';
export type { UseAxioResQueryOptions } from './react';
