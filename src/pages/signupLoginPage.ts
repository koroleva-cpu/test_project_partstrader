import type { Page } from '@playwright/test';

/** The /login page, which holds both the login form and the first step of signup. */
export class SignupLoginPage {
  constructor(private readonly page: Page) {}

  /** Submits the "New User Signup!" form, which leads to the account details form. */
  async startSignup(name: string, email: string): Promise<void> {
    await this.page.getByTestId('signup-name').fill(name);
    await this.page.getByTestId('signup-email').fill(email);
    await this.page.getByTestId('signup-button').click();
  }
}
