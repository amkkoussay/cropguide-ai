/**
 * Resolves with a source value when it arrives promptly, or undefined after the
 * caller-defined deadline. It intentionally does not cancel the source because
 * browser APIs such as geolocation do not expose a cancellation handle.
 */
export function resolveWithin<T>(source: Promise<T>, timeoutMs: number): Promise<T | undefined> {
  return Promise.race([
    source,
    new Promise<undefined>(resolve => globalThis.setTimeout(() => resolve(undefined), timeoutMs)),
  ]);
}
