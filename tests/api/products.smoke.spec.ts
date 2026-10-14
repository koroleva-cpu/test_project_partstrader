import { expect, test } from '../../src/fixtures';

test('products list API responds', async ({ request }) => {
  const response = await request.get('/api/productsList');
  const body = await response.json();

  // The API always answers HTTP 200 and reports the real status in the body.
  expect(body.responseCode).toBe(200);
});
