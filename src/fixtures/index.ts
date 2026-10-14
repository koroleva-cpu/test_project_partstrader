import { test as base, expect } from '@playwright/test';
import { AccountClient } from '../api/accountClient';
import { environment } from '../config/environments';
import { unreachableReason } from '../config/reachability';
import { buildUser, type User } from '../data/factories';
import { AccountFlow } from '../flows/accountFlow';
import { OrderFlow } from '../flows/orderFlow';
import { createPages, type Pages } from '../pages';
import { blockThirdParties } from './blockThirdParties';

interface Fixtures {
  skipIfUnreachable: undefined;
  /** Client for the account API endpoints. Needs no browser. */
  accountClient: AccountClient;
  /** Every page object, bound to the test's page. */
  pages: Pages;
  accountFlow: AccountFlow;
  orderFlow: OrderFlow;
  /**
   * Data for a user that does not exist yet, for tests that register through
   * the UI. The account is removed afterwards if the test left one behind.
   */
  newUser: User;
  /** A user that already exists, created through the API and deleted after the test. */
  registeredUser: User;
}

/**
 * The project's `test`. Specs import `test` and `expect` from here, never from
 * '@playwright/test', so every test gets the shared fixtures.
 */
export const test = base.extend<Fixtures>({
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

  context: async ({ context }, use) => {
    await blockThirdParties(context);
    await use(context);
  },

  accountClient: async ({ request }, use) => {
    await use(new AccountClient(request));
  },

  pages: async ({ page }, use) => {
    await use(createPages(page));
  },

  accountFlow: async ({ pages }, use) => {
    await use(new AccountFlow(pages));
  },

  orderFlow: async ({ pages }, use) => {
    await use(new OrderFlow(pages));
  },

  newUser: async ({ accountClient }, use) => {
    const user = buildUser();
    await use(user);
    // Safety net for a test that failed before its own delete step. When the
    // account is already gone the API answers "not found", which is fine.
    await accountClient.deleteAccount(user);
  },

  registeredUser: async ({ accountClient }, use) => {
    const user = buildUser();
    const created = await accountClient.createAccount(user);
    expect(created, 'the test user is created through the API').toMatchObject({
      responseCode: 201,
    });
    await use(user);
    await accountClient.deleteAccount(user);
  },
});

export { expect };
