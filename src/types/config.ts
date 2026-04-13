/**
 * @module types/config
 * Configuration types for createAxioRes and its plugin system.
 */

import type { AxiosRequestConfig } from 'axios';
import type { ZodSchema } from 'zod';

// ────────────────────────────────────────────────────────────────
// Plugin Configs
// ────────────────────────────────────────────────────────────────

/** Mocking plugin — intercept requests and return static or dynamic data. */
export interface MockPluginConfig {
  /** Enable or disable mocking globally. */
  enabled: boolean;
  /** Artificial delay in milliseconds to simulate network latency. */
  delay?: number;
  /**
   * Map of URL patterns → mock data.
   * Values can be static objects or factory functions (e.g. for Faker.js).
   */
  dataMap: Record<string, unknown | (() => unknown)>;
}

/** StateSync plugin — push successful responses to an external store. */
export interface StateSyncPluginConfig {
  /**
   * Called after every successful request.
   * @param key - The syncKey provided in the request options, or the URL.
   * @param data - The response data.
   */
  onSync: (key: string, data: unknown) => void;
}

/** Aggregate plugin configuration. */
export interface AxioResPlugins {
  mock?: MockPluginConfig;
  stateSync?: StateSyncPluginConfig;
}

// ────────────────────────────────────────────────────────────────
// Main Config
// ────────────────────────────────────────────────────────────────

/** Configuration passed to `createAxioRes()`. */
export interface AxioResConfig extends AxiosRequestConfig {
  plugins?: AxioResPlugins;
}

// ────────────────────────────────────────────────────────────────
// Per-Request Options
// ────────────────────────────────────────────────────────────────

/** Extra options accepted by every wrapped request method. */
export interface AxioResRequestOptions<T = unknown> {
  /** Optional Zod schema to validate the response against. */
  schema?: ZodSchema<T>;
  /** Key used by the StateSync plugin. Defaults to the request URL. */
  syncKey?: string;
}
