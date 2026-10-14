import type { Page } from '@playwright/test';
import { CartPage } from './cartPage';
import { CheckoutPage } from './checkoutPage';
import { Header } from './components/header';
import { ConfirmationPage } from './confirmationPage';
import { HomePage } from './homePage';
import { PaymentPage } from './paymentPage';
import { SignupLoginPage } from './signupLoginPage';
import { SignupPage } from './signupPage';

/** Every page object, built around one browser page. */
export interface Pages {
  header: Header;
  home: HomePage;
  cart: CartPage;
  signupLogin: SignupLoginPage;
  signup: SignupPage;
  confirmation: ConfirmationPage;
  checkout: CheckoutPage;
  payment: PaymentPage;
}

/** Page objects only hold locators, so creating all of them up front costs nothing. */
export function createPages(page: Page): Pages {
  return {
    header: new Header(page),
    home: new HomePage(page),
    cart: new CartPage(page),
    signupLogin: new SignupLoginPage(page),
    signup: new SignupPage(page),
    confirmation: new ConfirmationPage(page),
    checkout: new CheckoutPage(page),
    payment: new PaymentPage(page),
  };
}
