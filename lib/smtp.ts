import 'server-only';
import nodemailer from 'nodemailer';

export function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.EMAIL_FROM,
  );
}

function transporter() {
  if (!smtpConfigured()) throw new Error('SMTP is not configured.');
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SMTP_PORT is invalid.');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD},
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
  });
}

export async function sendMail(options: {to: string; replyTo?: string; subject: string; text: string}) {
  const info = await transporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });
  if (!info.accepted.length) throw new Error('SMTP server did not accept the recipient.');
  return info.messageId;
}
