// Deprecated: former Lovable error reporting shim. Replaced by a generic reporter.
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  try {
    console.error('[Runtime error]', error, context);
  } catch (e) {}
}
