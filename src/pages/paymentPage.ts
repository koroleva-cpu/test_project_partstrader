import type { Page } from '@playwright/test';
import type { PaymentCard } from '../data/factories';

const SHOWN_MESSAGE_KEY = 'qa-success-message-on-submit';

export class PaymentPage {
  constructor(private readonly page: Page) {}

  /**
   * Fills the card form and confirms the order, which leads to the order
   * placed screen. Returns the success message the page showed on submit, or
   * an empty string if it showed none.
   *
   * The site shows that message only briefly, while it is already redirecting
   * to the order placed screen. Playwright blocks locators while a navigation
   * is pending, so asserting on it directly would be a race. A submit listener
   * records what was showing instead, in sessionStorage so the value survives
   * the redirect.
   */
  async pay(card: PaymentCard): Promise<string> {
    // The page binds the handler that reveals the message in a script at the
    // end of the document, so it must have finished loading before submitting.
    await this.page.waitForLoadState('load');

    await this.page.getByTestId('name-on-card').fill(card.nameOnCard);
    await this.page.getByTestId('card-number').fill(card.number);
    await this.page.getByTestId('cvc').fill(card.cvc);
    await this.page.getByTestId('expiry-month').fill(card.expiryMonth);
    await this.page.getByTestId('expiry-year').fill(card.expiryYear);

    await this.recordSuccessMessageOnSubmit();
    await this.page.getByTestId('pay-button').click();
    await this.page.waitForURL('**/payment_done/**');

    const shown = await this.page.evaluate((key) => sessionStorage.getItem(key), SHOWN_MESSAGE_KEY);
    return shown ?? '';
  }

  private async recordSuccessMessageOnSubmit(): Promise<void> {
    await this.page.evaluate((key) => {
      // Listening on the document means this runs when the event bubbles up,
      // after the form's own handler has revealed the message.
      document.addEventListener('submit', () => {
        const message = document.querySelector<HTMLElement>('#success_message');
        // offsetParent is null while the element or an ancestor is hidden with display:none.
        const isShowing = message !== null && message.offsetParent !== null;
        sessionStorage.setItem(key, isShowing ? message.innerText.trim() : '');
      });
    }, SHOWN_MESSAGE_KEY);
  }
}
