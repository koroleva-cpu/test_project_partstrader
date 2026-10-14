import type { Page } from '@playwright/test';
import type { User } from '../data/factories';

/** The account details form at /signup, reached after the first signup step. */
export class SignupPage {
  constructor(private readonly page: Page) {}

  /** Fills every field and submits. Name and email are already set by the previous step. */
  async createAccount(user: User): Promise<void> {
    const { page } = this;

    await page.locator(`input[name="title"][value="${user.title}"]`).check();
    await page.getByTestId('password').fill(user.password);
    await page.getByTestId('days').selectOption(user.birthDay);
    await page.getByTestId('months').selectOption(user.birthMonth);
    await page.getByTestId('years').selectOption(user.birthYear);
    await page.getByLabel('Sign up for our newsletter!').check();
    await page.getByLabel('Receive special offers from our partners!').check();

    await page.getByTestId('first_name').fill(user.firstName);
    await page.getByTestId('last_name').fill(user.lastName);
    await page.getByTestId('company').fill(user.company);
    await page.getByTestId('address').fill(user.address1);
    await page.getByTestId('address2').fill(user.address2);
    await page.getByTestId('country').selectOption(user.country);
    await page.getByTestId('state').fill(user.state);
    await page.getByTestId('city').fill(user.city);
    await page.getByTestId('zipcode').fill(user.zipcode);
    await page.getByTestId('mobile_number').fill(user.mobileNumber);

    await page.getByTestId('create-account').click();
  }
}
