import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { User } from '../data/factories';

export interface Credentials {
  email: string;
  password: string;
}

export type HttpMethod = 'POST' | 'DELETE';

export interface ApiResult {
  /** The transport status. The API answers 200 even for errors, so this is rarely the one to assert on. */
  httpStatus: number;
  /** The real outcome, reported in the JSON body. */
  responseCode: number;
  message: string;
}

async function toResult(response: APIResponse): Promise<ApiResult> {
  const body = await response.json();
  return {
    httpStatus: response.status(),
    responseCode: body.responseCode,
    message: body.message,
  };
}

/**
 * Thin wrapper over the account endpoints. It never throws on an error code:
 * callers get the result back and decide what is expected, which is what the
 * negative API tests need.
 *
 * The API only reads form-encoded bodies, hence `form` instead of `data`.
 */
export class AccountClient {
  constructor(private readonly request: APIRequestContext) {}

  async createAccount(user: User): Promise<ApiResult> {
    const response = await this.request.post('/api/createAccount', {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: user.title,
        birth_date: user.birthDay,
        birth_month: user.birthMonth,
        birth_year: user.birthYear,
        firstname: user.firstName,
        lastname: user.lastName,
        company: user.company,
        address1: user.address1,
        address2: user.address2,
        country: user.country,
        zipcode: user.zipcode,
        state: user.state,
        city: user.city,
        mobile_number: user.mobileNumber,
      },
    });
    return toResult(response);
  }

  async deleteAccount({ email, password }: Credentials): Promise<ApiResult> {
    const response = await this.request.delete('/api/deleteAccount', {
      form: { email, password },
    });
    return toResult(response);
  }

  /**
   * Either field may be left out to exercise the "missing parameter" responses,
   * and `method` may be changed to exercise the "method not supported" response.
   */
  async verifyLogin(
    { email, password }: Partial<Credentials> = {},
    method: HttpMethod = 'POST',
  ): Promise<ApiResult> {
    const form: Record<string, string> = {};
    if (email !== undefined) form.email = email;
    if (password !== undefined) form.password = password;

    const response = await this.request.fetch('/api/verifyLogin', { method, form });
    return toResult(response);
  }
}
