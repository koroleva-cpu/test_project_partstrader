import { faker } from '@faker-js/faker';
import { environment } from '../config/environments';

/** The only countries the signup form offers. */
export const COUNTRIES = [
  'India',
  'United States',
  'Canada',
  'Australia',
  'Israel',
  'New Zealand',
  'Singapore',
] as const;

export type Country = (typeof COUNTRIES)[number];
export type Title = 'Mr' | 'Mrs';

export interface User {
  title: Title;
  /** Display name, shown in the header as "Logged in as <name>". */
  name: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: Country;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface PaymentCard {
  nameOnCard: string;
  number: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/**
 * The site is shared and never cleaned, so a plain Faker email could already be
 * taken. The random suffix makes a collision practically impossible, and
 * example.com guarantees no real mailbox is involved.
 */
function uniqueEmail(firstName: string, lastName: string): string {
  const local = faker.internet.username({ firstName, lastName });
  const suffix = faker.string.alphanumeric({ length: 10, casing: 'lower' });
  return `${local}.${suffix}@example.com`.toLowerCase();
}

/** Builds a user with random data. Pass overrides to pin the fields a test cares about. */
export function buildUser(overrides: Partial<User> = {}): User {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 80 });

  return {
    title: faker.helpers.arrayElement<Title>(['Mr', 'Mrs']),
    name: `${firstName} ${lastName}`,
    email: uniqueEmail(firstName, lastName),
    password: environment.password,
    birthDay: String(birthDate.getDate()),
    birthMonth: String(birthDate.getMonth() + 1),
    birthYear: String(birthDate.getFullYear()),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: faker.helpers.arrayElement(COUNTRIES),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number({ style: 'international' }),
    ...overrides,
  };
}

/** Builds a card that expires in the future. The site accepts any values, so no real card is needed. */
export function buildPaymentCard(overrides: Partial<PaymentCard> = {}): PaymentCard {
  const expiry = faker.date.future({ years: 4 });

  return {
    nameOnCard: faker.person.fullName(),
    number: faker.finance.creditCardNumber({ issuer: 'visa' }).replace(/\D/g, ''),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: String(expiry.getMonth() + 1).padStart(2, '0'),
    expiryYear: String(expiry.getFullYear()),
    ...overrides,
  };
}
