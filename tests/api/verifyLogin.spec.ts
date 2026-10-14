import { buildUser } from '../../src/data/factories';
import { expect, test } from '../../src/fixtures';

// The API answers HTTP 200 for every outcome and reports the real one in the
// body, so the tests assert on the body's responseCode and message.
const USER_EXISTS = { responseCode: 200, message: 'User exists!' };
const MISSING_PARAMETER = {
  responseCode: 400,
  message: 'Bad request, email or password parameter is missing in POST request.',
};
const USER_NOT_FOUND = { responseCode: 404, message: 'User not found!' };
const METHOD_NOT_SUPPORTED = {
  responseCode: 405,
  message: 'This request method is not supported.',
};

test.describe('verifyLogin: documented cases', () => {
  test('API 7: valid email and password confirm the user exists', async ({
    accountClient,
    registeredUser,
  }) => {
    const result = await accountClient.verifyLogin(registeredUser);

    expect(result).toMatchObject(USER_EXISTS);
  });

  test('API 8: a request without the email parameter is rejected', async ({ accountClient }) => {
    const { password } = buildUser();

    const result = await accountClient.verifyLogin({ password });

    expect(result).toMatchObject(MISSING_PARAMETER);
  });

  test('API 9: the DELETE method is not supported', async ({ accountClient }) => {
    const result = await accountClient.verifyLogin({}, 'DELETE');

    expect(result).toMatchObject(METHOD_NOT_SUPPORTED);
  });

  test('API 10: credentials of a user that does not exist are not found', async ({
    accountClient,
  }) => {
    const neverRegistered = buildUser();

    const result = await accountClient.verifyLogin(neverRegistered);

    expect(result).toMatchObject(USER_NOT_FOUND);
  });
});

test.describe('verifyLogin: edge cases', () => {
  // API 8 only covers a missing email; the password must be required too.
  test('a request without the password parameter is rejected', async ({
    accountClient,
    registeredUser,
  }) => {
    const result = await accountClient.verifyLogin({ email: registeredUser.email });

    expect(result).toMatchObject(MISSING_PARAMETER);
  });

  // API 10 uses an unknown user. A real user with a wrong password must get
  // the same answer, so the response does not reveal which emails are registered.
  test('a wrong password for an existing user is not found', async ({
    accountClient,
    registeredUser,
  }) => {
    const result = await accountClient.verifyLogin({
      email: registeredUser.email,
      password: `${registeredUser.password}x`,
    });

    expect(result).toMatchObject(USER_NOT_FOUND);
  });

  test('login stops working once the account is deleted', async ({
    accountClient,
    registeredUser,
  }) => {
    expect(await accountClient.verifyLogin(registeredUser)).toMatchObject(USER_EXISTS);

    const deleted = await accountClient.deleteAccount(registeredUser);
    expect(deleted).toMatchObject({ responseCode: 200, message: 'Account deleted!' });

    expect(await accountClient.verifyLogin(registeredUser)).toMatchObject(USER_NOT_FOUND);
  });
});
