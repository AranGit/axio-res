/**
 * @module plugins/stateSync
 * StateSync plugin — pushes successful response data to an external store.
 */

import type { StateSyncPluginConfig } from '../types/config';

/**
 * Sync response data using the configured onSync callback.
 * @param config - The StateSync plugin configuration.
 * @param key - The sync key (usually the URL or a custom key).
 * @param data - The response data to sync.
 */
export const syncState = (
  config: StateSyncPluginConfig,
  key: string,
  data: unknown,
): void => {
  try {
    config.onSync(key, data);
  } catch {
    // StateSync should never break the main flow — silently ignore errors.
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[axio-res] StateSync failed for key "${key}"`);
    }
  }
};
