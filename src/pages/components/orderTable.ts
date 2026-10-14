import type { Locator } from '@playwright/test';
import type { Product } from './productList';

export interface OrderLine {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

/** Converts a displayed price such as "Rs. 500" to 500. */
export function parsePrice(text: string): number {
  const digits = text.replace(/\D/g, '');
  if (digits === '') {
    throw new Error(`No price found in "${text}"`);
  }
  return Number(digits);
}

/** Formats 500 the way the site displays it: "Rs. 500". */
export function formatPrice(amount: number): string {
  return `Rs. ${amount}`;
}

/** The lines a table should show after each of the given products was added once. */
export function orderLinesFor(products: Product[]): OrderLine[] {
  return products.map(({ name, price }) => ({ name, price, quantity: 1, total: price }));
}

/** The product table, which the cart and the checkout review both render the same way. */
export class OrderTable {
  readonly rows: Locator;

  constructor(root: Locator) {
    // Product rows carry an id; the header and "Total Amount" rows do not.
    this.rows = root.locator('tr[id^="product-"]');
  }

  async lines(): Promise<OrderLine[]> {
    const rows = await this.rows.all();
    return Promise.all(
      rows.map(async (row) => ({
        name: await row.locator('.cart_description a').innerText(),
        price: parsePrice(await row.locator('.cart_price').innerText()),
        quantity: Number(await row.locator('.cart_quantity').innerText()),
        total: parsePrice(await row.locator('.cart_total').innerText()),
      })),
    );
  }
}
