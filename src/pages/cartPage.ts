import type { Locator, Page } from '@playwright/test';
import { OrderTable } from './components/orderTable';

export class CartPage {
  /** Reads "Shopping Cart" on this page. */
  readonly breadcrumb: Locator;
  readonly order: OrderTable;
  private readonly checkoutModal: Locator;

  constructor(private readonly page: Page) {
    this.breadcrumb = page.locator('.breadcrumb .active');
    this.order = new OrderTable(page.locator('#cart_info'));
    this.checkoutModal = page.locator('#checkoutModal');
  }

  async open(): Promise<void> {
    await this.page.goto('/view_cart');
  }

  /** Goes to checkout when logged in; otherwise the site opens a dialog asking to register or log in. */
  async proceedToCheckout(): Promise<void> {
    await this.page.getByText('Proceed To Checkout').click();
  }

  /** Follows the "Register / Login" link in the dialog shown to guests. */
  async registerOrLoginFromCheckout(): Promise<void> {
    await this.checkoutModal.getByRole('link', { name: 'Register / Login' }).click();
  }
}
