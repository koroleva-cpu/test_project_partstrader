import type { Locator, Page } from '@playwright/test';

/** The navigation bar shown on every page. */
export class Header {
  /** Reads "Logged in as <name>" once a user is signed in. */
  readonly loggedInAs: Locator;
  private readonly nav: Locator;

  constructor(page: Page) {
    this.nav = page.locator('#header .navbar-nav');
    this.loggedInAs = this.nav.getByText('Logged in as');
  }

  async goToCart(): Promise<void> {
    await this.nav.getByRole('link', { name: 'Cart' }).click();
  }

  async goToSignupLogin(): Promise<void> {
    await this.nav.getByRole('link', { name: 'Signup / Login' }).click();
  }

  async deleteAccount(): Promise<void> {
    await this.nav.getByRole('link', { name: 'Delete Account' }).click();
  }
}
