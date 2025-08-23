// Vitest setup globals - provide a lightweight compatibility shim for tests
// that still reference the Jest global `jest` at runtime.
import { vi } from 'vitest';

// Expose `jest` as an alias to Vitest's `vi` so existing test code using
// `jest.fn()`, `jest.spyOn()` etc. continues to work without changes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).jest = vi;

export const __vitest_setup_noop = (): void => undefined;
