import type { Locator, Page } from '@playwright/test';

/**
 * The "done" screens for account created, order placed and account deleted.
 * All three share one layout, a heading and a Continue button, so one page
 * object covers them and each heading tells which screen is showing.
 */
export class ConfirmationPage {
  readonly accountCreated: Locator;
  readonly orderPlaced: Locator;
  /** Reads "Congratulations! Your order has been confirmed!" on the order placed screen. */
  readonly orderConfirmedMessage: Locator;
  readonly accountDeleted: Locator;

  constructor(private readonly page: Page) {
    this.accountCreated = page.getByTestId('account-created');
    this.orderPlaced = page.getByTestId('order-placed');
    this.orderConfirmedMessage = page.getByText('Your order has been confirmed!');
    this.accountDeleted = page.getByTestId('account-deleted');
  }

  /** Returns to the home page. */
  async continue(): Promise<void> {
    await this.page.getByTestId('continue-button').click();
  }
}
