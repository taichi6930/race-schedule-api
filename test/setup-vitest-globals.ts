// Vitest setup globals - expose `jest` as an alias to `vi`
// Ensure reflect-metadata is loaded for libraries like tsyringe.
import 'reflect-metadata';

// If Vitest has provided `vi` on the global object at runtime, alias it to `jest`.
if ((globalThis as any).vi) {
    (globalThis as any).jest = (globalThis as any).vi;
}
