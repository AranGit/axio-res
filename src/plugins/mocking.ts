/**
 * @module plugins/mocking
 * Mock plugin — intercepts requests and returns mock data without hitting the network.
 */

import type { MockPluginConfig } from '../types/config';

/**
 * Resolve mock data for a given URL from the dataMap.
 * Supports both static values and factory functions (for Faker.js etc.).
 */
export const resolveMockData = (
  url: string,
  config: MockPluginConfig,
): { matched: true; data: unknown } | { matched: false } => {
  // Exact match first
  if (url in config.dataMap) {
    const entry = config.dataMap[url];
    const data = typeof entry === 'function' ? (entry as () => unknown)() : entry;
    return { matched: true, data };
  }

  // Pattern match — check if any key is a substring of the URL
  for (const [pattern, entry] of Object.entries(config.dataMap)) {
    if (url.includes(pattern)) {
      const data = typeof entry === 'function' ? (entry as () => unknown)() : entry;
      return { matched: true, data };
    }
  }

  return { matched: false };
};

/**
 * Simulate network delay.
 */
export const simulateDelay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
