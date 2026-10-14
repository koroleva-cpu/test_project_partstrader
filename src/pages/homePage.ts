import type { Locator, Page } from '@playwright/test';
import { ProductList } from './components/productList';

export class HomePage {
  /** Heading of the main product grid; visible once the page has rendered. */
  readonly featuredItemsHeading: Locator;
  readonly products: ProductList;

  constructor(private readonly page: Page) {
    this.featuredItemsHeading = page.getByRole('heading', { name: 'Features Items' });
    this.products = new ProductList(page);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }
}
