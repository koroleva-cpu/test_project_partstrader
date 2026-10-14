import { faker } from '@faker-js/faker';
import { buildPaymentCard, type User } from '../../src/data/factories';
import { expect, test } from '../../src/fixtures';
import type { OrderDetails } from '../../src/flows/orderFlow';
import type { Product } from '../../src/pages/components/productList';

// Both cases place the same order and differ only in when the user registers,
// so they share the flows in src/flows. Step numbers refer to the official
// test cases at https://automationexercise.com/test_cases.
const PRODUCT_COUNT = 2;

/** A fresh card and comment for each order, so no two runs submit the same data. */
function orderDetails(user: User, products: Product[]): OrderDetails {
  return { user, products, card: buildPaymentCard(), comment: faker.lorem.sentence() };
}

test.describe('Place Order', () => {
  test('Test Case 14: Register while Checkout', async ({
    pages,
    accountFlow,
    orderFlow,
    newUser,
  }) => {
    // Steps 1-3: open the site and check the home page is showing.
    await pages.home.open();
    await expect(pages.home.featuredItemsHeading).toBeVisible();

    // Steps 4-8: as a guest, fill the cart and get sent to registration from checkout.
    const products = await orderFlow.addProductsToCart(PRODUCT_COUNT);
    await orderFlow.openCart(products);
    await pages.cart.proceedToCheckout();
    await pages.cart.registerOrLoginFromCheckout();

    // Steps 9-11: sign up, see "Account Created!" and "Logged in as <name>".
    await accountFlow.register(newUser);

    // Steps 12-18: the review also proves the guest's cart survived registration.
    await orderFlow.checkoutAndPay(orderDetails(newUser, products));

    // Steps 19-20: delete the account and see "Account Deleted!".
    await accountFlow.deleteAccount();
  });

  test('Test Case 15: Register before Checkout', async ({
    pages,
    accountFlow,
    orderFlow,
    newUser,
  }) => {
    // Steps 1-3: open the site and check the home page is showing.
    await pages.home.open();
    await expect(pages.home.featuredItemsHeading).toBeVisible();

    // Steps 4-7: sign up first, see "Account Created!" and "Logged in as <name>".
    await pages.header.goToSignupLogin();
    await accountFlow.register(newUser);

    // Step 8: registration ends on the home page, where the products are.
    const products = await orderFlow.addProductsToCart(PRODUCT_COUNT);

    // Steps 9-16: cart, address and order review, comment, payment, confirmation.
    await orderFlow.checkoutAndPay(orderDetails(newUser, products));

    // Steps 17-18: delete the account and see "Account Deleted!".
    await accountFlow.deleteAccount();
  });
});
