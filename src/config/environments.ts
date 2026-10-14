import 'dotenv/config';

export type EnvironmentName = 'dev' | 'test';

export interface Environment {
  name: EnvironmentName;
  baseUrl: string;
  /** Password shared by every user created in this environment. */
  password: string;
}

// The passwords are the ones published in EXERCISE.md, so they are kept here as
// defaults. A real project would read them from a secret store via USER_PASSWORD.
const environments: Record<EnvironmentName, Environment> = {
  dev: {
    name: 'dev',
    baseUrl: 'https://automationexercise.com/',
    password: 'D3v3nv1r0m3nt',
  },
  test: {
    name: 'test',
    baseUrl: 'https://test.automationexercise.com/',
    password: 'T35t3nv1r0m3nt',
  },
};

const DEFAULT_ENVIRONMENT: EnvironmentName = 'dev';

function isEnvironmentName(value: string): value is EnvironmentName {
  return Object.hasOwn(environments, value);
}

function resolveEnvironment(): Environment {
  const requested = process.env.TEST_ENV?.trim().toLowerCase() || DEFAULT_ENVIRONMENT;
  if (!isEnvironmentName(requested)) {
    const known = Object.keys(environments).join(', ');
    throw new Error(`Unknown TEST_ENV "${requested}". Expected one of: ${known}.`);
  }
  const selected = environments[requested];
  return { ...selected, password: process.env.USER_PASSWORD || selected.password };
}

/** Settings for the environment selected by TEST_ENV (defaults to dev). */
export const environment: Environment = resolveEnvironment();
