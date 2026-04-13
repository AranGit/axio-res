/**
 * @module core/createAxioRes
 * Factory function that wraps Axios with the Result Monad pattern.
 *
 * Every method returns Promise<Result<T, AxioResError>> instead of throwing.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ok, fail } from '../types/result';
import { createZodValidationError } from '../types/errors';
import { resolveMockData, simulateDelay } from '../plugins/mocking';
import { syncState } from '../plugins/stateSync';
import type { Result } from '../types/result';
import type { AxioResConfig, AxioResRequestOptions } from '../types/config';
import type { AxioResError } from '../types/errors';

// ────────────────────────────────────────────────────────────────
// AxioRes Instance Interface
// ────────────────────────────────────────────────────────────────

export interface AxioResInstance {
  /** HTTP GET — returns Result instead of throwing. */
  get<T = unknown>(
    url: string,
    options?: AxioResRequestOptions<T>,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>>;

  /** HTTP POST — returns Result instead of throwing. */
  post<T = unknown>(
    url: string,
    data?: unknown,
    options?: AxioResRequestOptions<T>,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>>;

  /** HTTP PUT — returns Result instead of throwing. */
  put<T = unknown>(
    url: string,
    data?: unknown,
    options?: AxioResRequestOptions<T>,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>>;

  /** HTTP PATCH — returns Result instead of throwing. */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    options?: AxioResRequestOptions<T>,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>>;

  /** HTTP DELETE — returns Result instead of throwing. */
  delete<T = unknown>(
    url: string,
    options?: AxioResRequestOptions<T>,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>>;

  /** Access the raw underlying Axios instance (escape hatch). */
  readonly axios: AxiosInstance;
}

// ────────────────────────────────────────────────────────────────
// Internal helpers (pure where possible)
// ────────────────────────────────────────────────────────────────

const validateWithSchema = <T>(
  data: unknown,
  options?: AxioResRequestOptions<T>,
): Result<T, AxioResError> => {
  if (!options?.schema) {
    return ok(data as T);
  }
  const parsed = options.schema.safeParse(data);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return fail(createZodValidationError(parsed.error));
};

// ────────────────────────────────────────────────────────────────
// Factory
// ────────────────────────────────────────────────────────────────

/**
 * Create an axio-res instance.
 *
 * @example
 * ```ts
 * const api = createAxioRes({ baseURL: 'https://api.example.com' });
 * const result = await api.get<User[]>('/users');
 * if (result.ok) console.log(result.value);
 * ```
 */
export const createAxioRes = (axioResConfig: AxioResConfig = {}): AxioResInstance => {
  const { plugins, ...axiosConfig } = axioResConfig;
  const instance: AxiosInstance = axios.create(axiosConfig);

  // ──────────── Mock-aware request executor ────────────

  const executeRequest = async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    options?: AxioResRequestOptions<T>,
    dataOrConfig?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<Result<T, AxioResError>> => {
    const syncKey = options?.syncKey ?? url;

    // ── Mock Plugin ──
    if (plugins?.mock?.enabled) {
      const mockResult = resolveMockData(url, plugins.mock);
      if (mockResult.matched) {
        if (plugins.mock.delay) {
          await simulateDelay(plugins.mock.delay);
        }
        // Validate mock data against schema if provided
        const validated = validateWithSchema<T>(mockResult.data, options);
        if (validated.ok && plugins?.stateSync) {
          syncState(plugins.stateSync, syncKey, validated.value);
        }
        return validated;
      }
    }

    // ── Real Request ──
    try {
      let response;
      switch (method) {
        case 'get':
        case 'delete':
          response = await instance[method](url, config);
          break;
        case 'post':
        case 'put':
        case 'patch':
          response = await instance[method](url, dataOrConfig, config);
          break;
      }

      // Validate against Zod schema if provided
      const validated = validateWithSchema<T>(response.data, options);

      // StateSync on success
      if (validated.ok && plugins?.stateSync) {
        syncState(plugins.stateSync, syncKey, validated.value);
      }

      return validated;
    } catch (error) {
      return fail(error as AxiosError);
    }
  };

  // ──────────── Public API ────────────

  return {
    get: <T>(
      url: string,
      options?: AxioResRequestOptions<T>,
      config?: AxiosRequestConfig,
    ) => executeRequest<T>('get', url, options, undefined, config),

    post: <T>(
      url: string,
      data?: unknown,
      options?: AxioResRequestOptions<T>,
      config?: AxiosRequestConfig,
    ) => executeRequest<T>('post', url, options, data, config),

    put: <T>(
      url: string,
      data?: unknown,
      options?: AxioResRequestOptions<T>,
      config?: AxiosRequestConfig,
    ) => executeRequest<T>('put', url, options, data, config),

    patch: <T>(
      url: string,
      data?: unknown,
      options?: AxioResRequestOptions<T>,
      config?: AxiosRequestConfig,
    ) => executeRequest<T>('patch', url, options, data, config),

    delete: <T>(
      url: string,
      options?: AxioResRequestOptions<T>,
      config?: AxiosRequestConfig,
    ) => executeRequest<T>('delete', url, options, undefined, config),

    get axios() {
      return instance;
    },
  };
};
