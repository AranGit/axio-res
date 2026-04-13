/**
 * @module react/useAxioResQuery
 * Bridge between axio-res and @tanstack/react-query.
 *
 * Unwraps the Result<T, E> so that React Query's `data` contains
 * the actual value, and errors are surfaced through `error`.
 */

import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query';
import type { AxioResInstance } from '../core/createAxioRes';
import type { AxioResRequestOptions } from '../types/config';
import type { AxioResError } from '../types/errors';

// ────────────────────────────────────────────────────────────────
// Options
// ────────────────────────────────────────────────────────────────

export interface UseAxioResQueryOptions<T> {
  /** The axio-res instance to use. */
  client: AxioResInstance;
  /** The URL to fetch. */
  url: string;
  /** React Query key. Defaults to [url]. */
  queryKey?: QueryKey;
  /** axio-res request options (schema, syncKey, etc.). */
  requestOptions?: AxioResRequestOptions<T>;
  /** Standard React Query options (staleTime, refetchInterval, etc.). */
  queryOptions?: Omit<
    UseQueryOptions<T, AxioResError>,
    'queryKey' | 'queryFn'
  >;
}

// ────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────

/**
 * React hook that bridges axio-res with @tanstack/react-query.
 *
 * @example
 * ```tsx
 * const { data, error, isLoading } = useAxioResQuery<User[]>({
 *   client: api,
 *   url: '/users',
 *   requestOptions: { schema: UsersSchema },
 * });
 * ```
 */
export const useAxioResQuery = <T = unknown>(
  options: UseAxioResQueryOptions<T>,
): UseQueryResult<T, AxioResError> => {
  const {
    client,
    url,
    queryKey,
    requestOptions,
    queryOptions,
  } = options;

  return useQuery<T, AxioResError>({
    queryKey: queryKey ?? [url],
    queryFn: async (): Promise<T> => {
      const result = await client.get<T>(url, requestOptions);

      if (result.ok) {
        return result.value;
      }

      // Throw so React Query captures it as an error
      throw result.error;
    },
    ...queryOptions,
  });
};
