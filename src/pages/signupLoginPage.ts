import type { Page } from '@playwright/test';
import type { Credentials } from '../api/accountClient';

/** The /login page, which holds both the login form and the first step of signup. */
export class SignupLoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/login');
  }

  /** Submits the "New User Signup!" form, which leads to the account details form. */
  async startSignup(name: string, email: string): Promise<void> {
    await this.page.getByTestId('signup-name').fill(name);
    await this.page.getByTestId('signup-email').fill(email);
    await this.page.getByTestId('signup-button').click();
  }

  async login({ email, password }: Credentials): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}
