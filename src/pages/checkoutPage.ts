import type { Locator, Page } from '@playwright/test';
import type { User } from '../data/factories';
import { OrderTable } from './components/orderTable';

/**
 * The lines the checkout page shows for a user's address, in display order.
 * Delivery and billing use the same format.
 */
export function addressLinesFor(user: User): string[] {
  return [
    `${user.title}. ${user.firstName} ${user.lastName}`,
    user.company,
    user.address1,
    user.address2,
    `${user.city} ${user.state} ${user.zipcode}`,
    user.country,
    user.mobileNumber,
  ];
}

export class CheckoutPage {
  /** One element per address line, without the block title. Compare with `addressLinesFor`. */
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly order: OrderTable;
  /** Reads the grand total, e.g. "Rs. 900". */
  readonly totalAmount: Locator;

  constructor(private readonly page: Page) {
    this.deliveryAddress = page.locator('#address_delivery li:not(.address_title)');
    this.billingAddress = page.locator('#address_invoice li:not(.address_title)');

    const review = page.locator('#cart_info');
    this.order = new OrderTable(review);
    this.totalAmount = review
      .locator('tr', { hasText: 'Total Amount' })
      .locator('.cart_total_price');
  }

  /** Adds the order comment and moves on to payment. */
  async placeOrder(comment: string): Promise<void> {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order' }).click();
  }
}
