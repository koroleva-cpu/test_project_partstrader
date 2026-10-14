import { environment } from './environments';
import { probeEnvironment, recordUnreachable } from './reachability';

/**
 * Checks once per run whether the selected environment responds.
 *
 * It records the result instead of throwing: a throw here would fail the whole
 * run, whereas the requirement is to skip. The auto-fixture in
 * src/fixtures/index.ts reads the result and skips each test.
 */
export default async function globalSetup(): Promise<void> {
  const reason = await probeEnvironment(environment.baseUrl);
  recordUnreachable(reason);
  if (reason !== undefined) {
    console.warn(
      `\n[${environment.name}] ${environment.baseUrl} is unreachable (${reason}). All tests will be skipped.\n`,
    );
  }
}
