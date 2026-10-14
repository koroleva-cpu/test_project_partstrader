import { expect, test } from '@playwright/test';
import type { PaymentCard, User } from '../data/factories';
import type { Pages } from '../pages';
import { addressLinesFor } from '../pages/checkoutPage';
import { formatPrice, orderLinesFor } from '../pages/components/orderTable';
import type { Product } from '../pages/components/productList';

export interface OrderDetails {
  /** The logged-in user, whose address the checkout page should show. */
  user: User;
  /** What was added to the cart, as returned by `addProductsToCart`. */
  products: Product[];
  card: PaymentCard;
  comment: string;
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

  /**
   * Works from any page while logged in with a filled cart. Checks the address
   * and the order review against what the test set up, then pays and ends on
   * the order placed screen.
   */
  async checkoutAndPay({ user, products, card, comment }: OrderDetails): Promise<void> {
    const { header, cart, checkout, payment, confirmation } = this.pages;

    await test.step('Check out and pay', async () => {
      await header.goToCart();
      await cart.proceedToCheckout();

      const address = addressLinesFor(user);
      await expect(checkout.deliveryAddress).toHaveText(address);
      await expect(checkout.billingAddress).toHaveText(address);

      const total = products.reduce((sum, product) => sum + product.price, 0);
      await expect(checkout.order.rows).toHaveCount(products.length);
      expect(await checkout.order.lines()).toEqual(orderLinesFor(products));
      await expect(checkout.totalAmount).toHaveText(formatPrice(total));

      await checkout.placeOrder(comment);
      await payment.pay(card);

      await expect(confirmation.orderPlaced).toHaveText('Order Placed!');
      await expect(confirmation.orderConfirmedMessage).toBeVisible();
    });
  }
}
