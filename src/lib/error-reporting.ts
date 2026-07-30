// Simple error reporting wrapper — logs to console and optionally forwards to a configured remote logger.
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  // Server-side: no-op
  if (typeof window === 'undefined') return;
  try {
    console.error('[Error Report]', error, context);
    // If the environment has an external telemetry hook, call it. This is intentionally
    // generic — replace with Sentry/LogRocket/etc. if you want production telemetry.
    if ((window as any).__appTelemetry?.captureException) {
      (window as any).__appTelemetry.captureException(error, { context });
    }
  } catch (e) {
    // swallow
  }
}
