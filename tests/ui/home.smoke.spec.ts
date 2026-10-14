import { expect, test } from '../../src/fixtures';

test('home page loads', async ({ page, pages }) => {
  await pages.home.open();

  await expect(page).toHaveTitle('Automation Exercise');
  await expect(pages.home.featuredItemsHeading).toBeVisible();
});
