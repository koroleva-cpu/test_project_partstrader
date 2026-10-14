import { expect, test } from '@playwright/test';
import type { User } from '../data/factories';
import type { Pages } from '../pages';

/** Account steps that span several pages and are shared by more than one test. */
export class AccountFlow {
  constructor(private readonly pages: Pages) {}

  /**
   * Starts on the Signup / Login page and ends on the home page, logged in as
   * the new user.
   */
  async register(user: User): Promise<void> {
    const { signupLogin, signup, confirmation, header } = this.pages;

    await test.step('Register a new account', async () => {
      await signupLogin.startSignup(user.name, user.email);
      await signup.createAccount(user);

      await expect(confirmation.accountCreated).toHaveText('Account Created!');
      await confirmation.continue();
      await expect(header.loggedInAs).toHaveText(`Logged in as ${user.name}`);
    });
  }

  /** Works from any page while logged in and ends on the home page, logged out. */
  async deleteAccount(): Promise<void> {
    const { header, confirmation } = this.pages;

    await test.step('Delete the account', async () => {
      await header.deleteAccount();

      await expect(confirmation.accountDeleted).toHaveText('Account Deleted!');
      await confirmation.continue();
    });
  }
}
