export type { Result } from './result';
export { ok, fail, map, flatMap, unwrapOr, match } from './result';

export type {
  AxioResConfig,
  AxioResPlugins,
  AxioResRequestOptions,
  MockPluginConfig,
  StateSyncPluginConfig,
} from './config';

export type { AxioResError, ZodValidationError } from './errors';
export { createZodValidationError } from './errors';
