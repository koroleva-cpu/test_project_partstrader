import { expect, test } from '@playwright/test';
import type { PaymentCard, User } from '../data/factories';
import type { Pages } from '../pages';
import { addressLinesFor } from '../pages/checkoutPage';
import { formatPrice, type OrderTable, orderLinesFor } from '../pages/components/orderTable';
import type { Product } from '../pages/components/productList';

export interface OrderDetails {
  /** The logged-in user, whose address the checkout page should show. */
  user: User;
  /** What was added to the cart, as returned by `addProductsToCart`. */
  products: Product[];
  card: PaymentCard;
  comment: string;
}

/** Checks that a cart or checkout table lists exactly the given products, once each. */
async function expectToList(table: OrderTable, products: Product[]): Promise<void> {
  // The count assertion retries until the table has rendered; lines() reads it once.
  await expect(table.rows).toHaveCount(products.length);
  expect(await table.lines()).toEqual(orderLinesFor(products));
}

/** Order steps that span several pages and are shared by more than one test. */
export class OrderFlow {
  constructor(private readonly pages: Pages) {}

  /** Starts on the home page and adds the first `count` products, one of each. */
  async addProductsToCart(count: number): Promise<Product[]> {
    return test.step(`Add ${count} products to the cart`, async () => {
      const products: Product[] = [];
      for (let index = 0; index < count; index++) {
        products.push(await this.pages.home.products.addToCart(index));
      }
      return products;
    });
  }

  /** Opens the cart from the header and checks it lists exactly the given products. */
  async openCart(products: Product[]): Promise<void> {
    const { header, cart } = this.pages;

    await test.step('Open the cart', async () => {
      await header.goToCart();

      await expect(cart.breadcrumb).toHaveText('Shopping Cart');
      await expectToList(cart.order, products);
    });
  }

  /**
   * Works from any page while logged in with a filled cart. Checks the cart,
   * the address and the order review against what the test set up, then pays
   * and ends on the order placed screen.
   */
  async checkoutAndPay({ user, products, card, comment }: OrderDetails): Promise<void> {
    const { cart, checkout, payment, confirmation } = this.pages;

    await this.openCart(products);

    await test.step('Check out and pay', async () => {
      await cart.proceedToCheckout();

      const address = addressLinesFor(user);
      await expect(checkout.deliveryAddress).toHaveText(address);
      await expect(checkout.billingAddress).toHaveText(address);

      const total = products.reduce((sum, product) => sum + product.price, 0);
      await expectToList(checkout.order, products);
      await expect(checkout.totalAmount).toHaveText(formatPrice(total));

      await checkout.placeOrder(comment);
      const messageOnSubmit = await payment.pay(card);

      // The message from the official steps shows only briefly before the
      // redirect, so it is checked from what the page showed on submit. The
      // order placed screen that follows is checked as well.
      expect(messageOnSubmit).toBe('Your order has been placed successfully!');
      await expect(confirmation.orderPlaced).toHaveText('Order Placed!');
      await expect(confirmation.orderConfirmedMessage).toBeVisible();
    });
  }
}
