# Issues

## Documented Issues

- Issue 1:
  - Description: Product cards in catalog grid are misaligned due to inconsistent image heights
  - Found by: Tatiana Koroleva during UI testing
  - Reproducible: Always
  - Severity: Major. This affects all product listing pages and is clearly visible to users.
  - Steps to reproduce:
    1. Open https://automationexercise.com/
    2. Scroll through the listing
  - Expected result:
    - All product images in the grid are displayed in a container of the same fixed size and aspect ratio (e.g. using object-fit: contain/cover).
    - All cards in a row have equal height.
    - Price, title and buttons are aligned on the same level across all cards.
    - No text overlaps images.
  - Actual result:
    - Product images have different heights and aspect ratios, so the cards in the same row have different heights.
    - Prices, product names, “Add to cart” and “View Product” buttons are not aligned horizontally across cards.
    - In “Regular Fit Straight Jeans”, the price “Rs. 1200” overlaps the bottom edge of the product image.
    - In “Grunt Blue Slim Fit Jeans”, there is a large empty gap between the image and the price.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - Screen resolution: 1920×1080
    - Environment: prod

- Issue 2:
  - Description: Product image on product page is distorted (aspect ratio not preserved)
  - Found by: Tatiana Koroleva. During UI testing
  - Reproducible: Always
  - Severity: Major. A distorted product photo misrepresents the product and directly affects the customer’s purchase decision.
  - Steps to reproduce:
    1. Open https://automationexercise.com/product_details/7
    2. Look at the main product image
  - Expected result:
    - The product image is displayed with its original aspect ratio, without stretching or squashing.
    - If the image does not fit the container, it is scaled proportionally (e.g. object-fit: contain or cover), not deformed.
  - Actual result:
    - The product image is stretched horizontally and squashed vertically, so the model and the product look visibly distorted (wider and flatter than in reality).
    - The original aspect ratio of the image is not preserved.
    - The image also looks blurry or pixelated.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - Screen resolution: 1920×1080
    - Environment: prod

- Issue 3:
  - Description: Cart item counter is not displayed in the header
  - Found by: Tatiana Koroleva. Functional testing
  - Reproducible: Always
  - Severity: Minor. Usability issue, the cart itself works.
  - Steps to reproduce:
    1. Log in to the site https://automationexercise.com/
    2. Add one or more products to the cart
    3. Look at the “Cart” link in the header menu
  - Expected result: The “Cart” link displays the current number of items in the cart (e.g. “Cart (2)” or a badge with the number), and the counter updates immediately after adding or removing products.
  - Actual result: The “Cart” link in the header shows no indication of the number of items in the cart. The user cannot see whether the cart has any products without opening it.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - Environment: prod

- Issue 4:
  - Description: User cannot view placed orders after checkout
  - Found by: Tatiana Koroleva. Functional testing. End-to-end testing.
  - Reproducible: Always
  - Severity: Major. Missing core e-commerce functionality: the user cannot check the status or details of their order
  - Steps to reproduce:
    1. Log in to the site https://automationexercise.com/
    2. Add a product to the cart
    3. Complete the checkout and place the order
    4. Try to find the placed order on the site (header menu, user account, etc.)
  - Expected result: A logged-in user can open an “My Orders” / “Order history” page and see a list of placed orders with details: order number, date, products, total amount and status.
  - Actual result: There is no section or link where the user can view placed orders (“My Orders”, “Order history”, etc.). After checkout, the order information is not accessible anywhere on the site.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - Environment: prod
    - Test account: kor1@ghil.com password 11111

- Issue 5:
  - Description: Server error (KeyError ‘user_id’) when clicking “Logout” several times
  - Found by: Tatiana Koroleva. Negative testing.
  - Reproducible: Sometimes
  - Severity: Major. The user sees a server error instead of the site.
  - Steps to reproduce:
    1. Open https://automationexercise.com
    2. Log in with a valid account
    3. Click “Logout” in the header menu several times in a row (quickly, before the page reloads)
  - Expected result: Repeated logout requests are handled correctly: no error is shown, the user is logged out and redirected to the home or login page.
  - Actual result:
    - The server returns a Django error page: KeyError at /logout ‘user_id’.
    - The first request logs the user out and removes user_id from the session. The next requests to /logout try to delete user_id again, but the key no longer exists, which causes an unhandled exception.
    - Exception location: django/contrib/sessions/backends/base.py, line 72, in \_\_delitem\_\_.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - URL: https://automationexercise.com/logout
    - Environment: prod
  

- Issue 6:
  - Description: Registration form accepts an invalid date of birth (31 February)
  - Found by: Tatiana Koroleva. Input validation, negative testing.
  - Reproducible: Always
  - Severity: Minor. Invalid data is saved to the user profile.
  - Steps to reproduce:
    1. Open https://automationexercise.com/login
    2. In “New User Signup!”, enter a name and a new email, click “Signup”
    3. On the “Enter Account Information” form, select Date of Birth: Day 31, Month February, Year [any, e.g. 1995]
    4. Fill in all other required fields and click “Create Account”
  - Expected result: The form validates the date of birth and does not allow non-existent dates. Either the Day list shows only valid days for the selected month (1–28/29 for February), or an error message is displayed, such as “Please enter a valid date of birth”, and the account is not created.
  - Actual result: The account is created successfully with the non-existent date of birth 31 February. No validation error is shown.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - URL: https://automationexercise.com/signup
    - Environment: prod

- Issue 7:
  - Description: The API returns HTTP status 200 for every outcome, including errors
  - Found by: Tatiana Koroleva. Observation while writing the verifyLogin API tests
  - Reproducible: Always
  - Severity: Major. API clients and monitoring that rely on the HTTP status cannot tell a failed request from a successful one.
  - Steps to reproduce:
    1. Send `POST https://automationexercise.com/api/verifyLogin` with only a `password` parameter (no `email`)
    2. Check the HTTP status of the response
  - Expected result: HTTP status 400 Bad Request, matching the error in the body.
  - Actual result: HTTP status 200 OK, with `{"responseCode": 400, "message": "Bad request, email or password parameter is missing in POST request."}` in the body. The same happens for 404 (user not found) and 405 (method not supported).
  - Environment:
    - Tool: Postman, curl and Playwright API requests
    - URL: https://automationexercise.com/api/verifyLogin
    - Environment: prod

- Issue 8:
  - Description: API responses contain JSON but are labelled as HTML
  - Found by: Tatiana Koroleva. Observation while writing the verifyLogin API tests
  - Reproducible: Always
  - Severity: Minor. Clients that choose a parser by content type treat the response as HTML.
  - Steps to reproduce:
    1. Send any request to `https://automationexercise.com/api/verifyLogin`
     2. Send `GET https://automationexercise.com/api/productsList`
    3. Check the `Content-Type` response header of both responses
  - Expected result: `Content-Type: application/json`
  - Actual result: `Content-Type: text/html; charset=utf-8`, while the body is JSON.
  - Environment:
    - Tool: curl, Postman
    - URL: https://automationexercise.com/api/verifyLogin
    - Environment: prod

- Issue 9:
  - Description: Unsupported HTTP methods on verifyLogin are handled inconsistently
  - Found by: Tatiana Koroleva. Exploratory API testing while writing the verifyLogin tests
  - Reproducible: Always
  - Severity: Minor. Contradictory responses make the API's behaviour hard to rely on.
  - Steps to reproduce:
    1. Send `DELETE https://automationexercise.com/api/verifyLogin` and check the status, headers and body
    2. Send `PATCH https://automationexercise.com/api/verifyLogin` and check the status and body
  - Expected result: Every unsupported method gets the same response: HTTP 405, the same body format, and an `Allow` header listing only `POST`.
  - Actual result:
    - DELETE (also GET and PUT): HTTP 200 with `{"responseCode": 405, "message": "This request method is not supported."}`, while the `Allow` header lists `PUT, GET, OPTIONS, DELETE, POST` as allowed.
    - PATCH: HTTP 405 with a different body format, `{"detail": "Method \"PATCH\" not allowed."}`.
  - Environment:
    - Tool: curl
    - URL: https://automationexercise.com/api/verifyLogin
    - Environment: prod

- Issue 10:
  - Description: verifyLogin treats email addresses as case-sensitive
  - Found by: Tatiana Koroleva. Exploratory API testing while writing the verifyLogin tests
  - Reproducible: Always
  - Severity: Minor. A user who types their email with different capitalisation is told the user does not exist. Not checked on the login page itself.
  - Steps to reproduce:
    1. Create an account through `POST /api/createAccount` with a lower-case email
    2. Send `POST /api/verifyLogin` with the same email in upper case and the correct password
  - Expected result: `{"responseCode": 200, "message": "User exists!"}`, since email addresses are conventionally matched case-insensitively.
  - Actual result: `{"responseCode": 404, "message": "User not found!"}`
  - Environment:
    - Tool: curl
    - URL: https://automationexercise.com/api/verifyLogin
    - Environment: prod

- Issue 11:
  - Description: "Add to cart" on listing pages and "Proceed To Checkout" in the cart cannot be reached with the keyboard
  - Found by: Tatiana Koroleva. Inspecting the page markup while writing locators; confirmed by tabbing through the pages
  - Reproducible: Always
  - Severity: Major. Users who navigate with a keyboard cannot add products to the cart from the listing or start checkout, so they cannot complete a purchase.
  - Steps to reproduce:
    1. Open https://automationexercise.com/
    2. Press Tab repeatedly through the page
    3. Add a product to the cart with the mouse and open https://automationexercise.com/view_cart
    4. Press Tab repeatedly through the page
  - Expected result: "Add to cart" and "Proceed To Checkout" receive focus and can be activated with Enter.
  - Actual result: Focus moves through the links on the page but never lands on "Add to cart" (home page) or "Proceed To Checkout" (cart page). Both are `<a>` elements with no `href` or `tabindex`, so the browser does not treat them as focusable. On the product details page, "Add to cart" is a `<button>` and works correctly with Tab and Enter.
  - Environment:
    - Browser: Chrome 153
    - OS: Windows 10
    - URLs: https://automationexercise.com/, https://automationexercise.com/view_cart
    - Environment: prod


- Issue 12:
  - Description: Typo in the home page heading "Features Items"
  - Found by: Tatiana Koroleva. UI testing
  - Reproducible: Always
  - Severity: Trivial. Cosmetic.
  - Steps to reproduce:
    1. Open https://automationexercise.com/
    2. Look at the heading above the product grid
  - Expected result: "Featured Items"
  - Actual result: "FEATURES ITEMS"
  - Environment:
    - Browser Chrome 153
    - OS: Windows 10
    - Environment: prod

---

## Links

[README](README.md) | [GETTING_STARTED](GETTING_STARTED.md)
