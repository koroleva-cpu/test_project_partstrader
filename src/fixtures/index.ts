import { test as base } from '@playwright/test';
import { environment } from '../config/environments';
import { unreachableReason } from '../config/reachability';

interface AutoFixtures {
  skipIfUnreachable: undefined;
}

/**
 * The project's `test`. Specs import `test` and `expect` from here, never from
 * '@playwright/test', so every test gets the shared fixtures.
 */
export const test = base.extend<AutoFixtures>({
  skipIfUnreachable: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright requires a destructured first argument
    async ({}, use, testInfo) => {
      const reason = unreachableReason();
      testInfo.skip(
        reason !== undefined,
        `${environment.name} environment (${environment.baseUrl}) is unreachable: ${reason}`,
      );
      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
