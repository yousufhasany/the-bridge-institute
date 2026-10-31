import { env, isProduction, isTest } from '../config/env.js';
import { logger } from '../lib/logger.js';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export const emailConfigured = () => Boolean(env.EMAIL_PROVIDER_API_KEY && env.EMAIL_FROM);

/**
 * Sends transactional email through Resend's HTTP API when configured.
 * Without configuration nothing is sent; in development the message is logged so
 * flows such as password reset can be exercised locally. Production never logs bodies.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!emailConfigured()) {
    if (!isProduction && !isTest) {
      logger.info({ to: message.to, subject: message.subject }, `[email:not-configured]\n${message.text}`);
    } else if (isProduction) {
      logger.warn({ subject: message.subject }, 'Email provider not configured; message not sent');
    }
    return false;
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.EMAIL_PROVIDER_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [message.to], subject: message.subject, text: message.text }),
    });
    if (!response.ok) {
      const detail = await response.text();
      logger.error({ status: response.status, detail }, 'Email provider rejected message');
      return false;
    }
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Email delivery failed');
    return false;
  }
}
