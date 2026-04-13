/**
 * @module types/errors
 * Custom error types for axio-res.
 */

import type { ZodError as ZodLibError } from 'zod';

// ────────────────────────────────────────────────────────────────
// Zod Validation Error
// ────────────────────────────────────────────────────────────────

export interface ZodValidationError {
  readonly type: 'ZOD_VALIDATION_ERROR';
  readonly message: string;
  readonly issues: ZodLibError['issues'];
}

export const createZodValidationError = (
  zodError: ZodLibError,
): ZodValidationError => ({
  type: 'ZOD_VALIDATION_ERROR',
  message: `Response validation failed: ${zodError.issues.map((i) => i.message).join(', ')}`,
  issues: zodError.issues,
});

// ────────────────────────────────────────────────────────────────
// Union of all possible error shapes
// ────────────────────────────────────────────────────────────────

import type { AxiosError } from 'axios';

export type AxioResError = AxiosError | ZodValidationError;
