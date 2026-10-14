import { expect, test } from '../../src/fixtures';

test('home page loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Automation Exercise');
});
