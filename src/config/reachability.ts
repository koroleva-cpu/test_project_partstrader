const UNREACHABLE_REASON_ENV = 'ENV_UNREACHABLE_REASON';
const PROBE_TIMEOUT_MS = 10_000;

function describeFailure(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }
  if (error.name === 'TimeoutError') {
    return `no response within ${PROBE_TIMEOUT_MS / 1000}s`;
  }
  // fetch wraps the network error (ENOTFOUND, ECONNREFUSED, ...) in `cause`.
  const cause = error.cause;
  if (cause instanceof Error) {
    const code = 'code' in cause ? `${cause.code}: ` : '';
    return `${code}${cause.message}`;
  }
  return error.message;
}

/**
 * Probes the environment once and returns why it is unreachable, or undefined
 * when it responds.
 *
 * Only network failures and 5xx responses count as unreachable. A 4xx means the
 * host is up and something else is wrong, which should fail loudly rather than
 * be hidden behind skipped tests.
 */
export async function probeEnvironment(baseUrl: string): Promise<string | undefined> {
  try {
    const response = await fetch(baseUrl, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
    return response.status >= 500 ? `responded with HTTP ${response.status}` : undefined;
  } catch (error) {
    return describeFailure(error);
  }
}

/**
 * Stores the probe result for the workers. Global setup runs in the main
 * process, and workers inherit its environment variables when they start.
 */
export function recordUnreachable(reason: string | undefined): void {
  if (reason === undefined) {
    delete process.env[UNREACHABLE_REASON_ENV];
  } else {
    process.env[UNREACHABLE_REASON_ENV] = reason;
  }
}

/** The reason recorded by global setup, or undefined when the environment is reachable. */
export function unreachableReason(): string | undefined {
  return process.env[UNREACHABLE_REASON_ENV];
}
