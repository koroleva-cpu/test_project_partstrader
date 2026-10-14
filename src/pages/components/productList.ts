import type { Locator, Page } from '@playwright/test';
import { parsePrice } from './orderTable';

export interface Product {
  name: string;
  price: number;
}

/** The grid of product cards on the home page. */
export class ProductList {
  private readonly cards: Locator;
  private readonly addedModal: Locator;

  constructor(page: Page) {
    // Scoped to the main grid: the "recommended items" carousel repeats the same products.
    this.cards = page.locator('.features_items .product-image-wrapper');
    this.addedModal = page.locator('#cartModal');
  }

  /**
   * Adds the product at the given position (0-based), closes the confirmation
   * dialog and returns what was added, so the test can check it in the cart.
   */
  async addToCart(index: number): Promise<Product> {
    // Each card holds the details twice; the second copy is a hover overlay.
    const info = this.cards.nth(index).locator('.productinfo');
    const product: Product = {
      name: await info.locator('p').innerText(),
      price: parsePrice(await info.locator('h2').innerText()),
    };

    await info.locator('.add-to-cart').click();
    await this.addedModal.getByRole('button', { name: 'Continue Shopping' }).click();
    // The dialog fades out; wait so it cannot cover the next click.
    await this.addedModal.waitFor({ state: 'hidden' });

    return product;
  }
}
