import type { BrowserContext } from '@playwright/test';

/**
 * Ad, consent and analytics hosts the site loads. None of them is under test.
 *
 * The ads matter most: Google shows full-screen "vignette" interstitials at
 * random moments, which swallow clicks and make tests flaky. The consent
 * dialog comes from fundingchoicesmessages.google.com, so blocking that host
 * also keeps the cookie banner from ever appearing.
 */
const BLOCKED_HOSTS = [
  'googlesyndication.com',
  'doubleclick.net',
  'adtrafficquality.google',
  'fundingchoicesmessages.google.com',
  'googletagmanager.com',
  'google-analytics.com',
  'cloudflareinsights.com',
];

const escaped = BLOCKED_HOSTS.map((host) => host.replaceAll('.', '\\.')).join('|');
const BLOCKED_URL = new RegExp(`^https?://([^/]+\\.)?(${escaped})/`);

/** Aborts requests to third parties that add noise and load time but no coverage. */
export async function blockThirdParties(context: BrowserContext): Promise<void> {
  await context.route(BLOCKED_URL, (route) => route.abort());
}
