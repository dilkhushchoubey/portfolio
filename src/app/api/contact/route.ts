import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Destination recipient email address
const RECIPIENT_EMAIL = 'dilkhushchoubey07@gmail.com';

// In-memory rate limiting and duplicate detection
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const recentSubmissions = new Map<string, number>();

// Clean up expired entries every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupMaps() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }

  for (const [hash, time] of recentSubmissions.entries()) {
    if (now - time > 5 * 60 * 1000) {
      recentSubmissions.delete(hash);
    }
  }
}

// HTML escape helper to prevent HTML injection in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  try {
    cleanupMaps();

    // 1. Extract IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // 2. Parse request body
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { name, email, subject, message, _gotcha } = body;

    // 3. Honeypot check for bots: silently pretend success without sending
    if (_gotcha) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully.',
      });
    }

    // 4. Validate fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name is too long (maximum 100 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length > 254 ||
      !emailRegex.test(email.trim())
    ) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please enter a subject.' },
        { status: 400 }
      );
    }

    if (subject.trim().length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject is too long (maximum 200 characters).' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message (at least 5 characters).' },
        { status: 400 }
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (maximum 5,000 characters).' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // 5. Rate limiting per IP: max 5 requests per 10 minutes
    const now = Date.now();
    const limitWindow = 10 * 60 * 1000;
    const ipRecord = rateLimitMap.get(ip);

    if (ipRecord) {
      if (now < ipRecord.resetTime) {
        if (ipRecord.count >= 5) {
          return NextResponse.json(
            {
              success: false,
              error: 'Too many submissions. Please wait a few minutes before trying again.',
            },
            { status: 429 }
          );
        }
        ipRecord.count += 1;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    }

    // 6. Duplicate submission detection (prevent resending identical payload within 60 seconds)
    const submissionKey = `${ip}-${trimmedEmail.toLowerCase()}-${trimmedSubject.toLowerCase()}-${trimmedMessage.slice(0, 100)}`;
    const lastSubmitted = recentSubmissions.get(submissionKey);
    if (lastSubmitted && now - lastSubmitted < 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          error: 'A duplicate message was already received. Please wait a moment before sending another.',
        },
        { status: 429 }
      );
    }
    recentSubmissions.set(submissionKey, now);

    // 7. Resend API configuration validation
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 'YOUR_NEW_RESEND_API_KEY' || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          isConfigError: true,
          error:
            'Resend API key is not configured. Please add your live RESEND_API_KEY in .env.local.',
        },
        { status: 503 }
      );
    }

    // 8. Sender address configuration
    const fromAddress =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Portfolio Contact <onboarding@resend.dev>';

    // 9. Send via Resend
    const resend = new Resend(apiKey.trim());

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeSubject = escapeHtml(trimmedSubject);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br />');

    const emailSubject = `Portfolio enquiry: ${trimmedSubject}`;

    const textContent = [
      `New Portfolio Enquiry`,
      ``,
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      `Subject: ${trimmedSubject}`,
      ``,
      `Message:`,
      trimmedMessage,
      ``,
      `---`,
      `Replying to this email will reply directly to ${trimmedEmail}`,
    ].join('\n');

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f3; margin: 0; padding: 40px 20px; color: #1a1a1a;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e3dc; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
    <tr>
      <td style="padding: 32px 32px 20px; border-bottom: 1px solid #eee;">
        <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #767471; font-weight: 600;">Portfolio Enquiry</span>
        <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 400; color: #1a1a1a; line-height: 1.3;">${safeSubject}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #fcfbf9; border-bottom: 1px solid #eee;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 4px 0; font-size: 13px; color: #767471; width: 70px;">From:</td>
            <td style="padding: 4px 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; font-size: 13px; color: #767471;">Email:</td>
            <td style="padding: 4px 0; font-size: 14px; color: #1a1a1a;">
              <a href="mailto:${safeEmail}" style="color: #1a1a1a; text-decoration: underline;">${safeEmail}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 32px; font-size: 15px; line-height: 1.6; color: #2c2b29;">
        <div style="font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #767471; margin-bottom: 12px; font-weight: 600;">Message</div>
        <div style="white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px; background-color: #f7f6f3; border-top: 1px solid #eee; font-size: 12px; color: #8c8984; text-align: center;">
        Dilkhush Choubey Photography Portfolio &bull; Replying directly will respond to ${safeEmail}
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [RECIPIENT_EMAIL],
      replyTo: trimmedEmail,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      const errorMsg = error.message || 'Failed to deliver message via Resend.';
      const lowerError = errorMsg.toLowerCase();

      // Check for domain verification requirement
      if (
        lowerError.includes('domain') ||
        lowerError.includes('verify') ||
        lowerError.includes('from') ||
        lowerError.includes('sender')
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Resend sender requirement: The sender address has not been verified in Resend. Please verify your domain in Resend and set RESEND_FROM_EMAIL in .env.local.',
          },
          { status: 422 }
        );
      }

      // Check for authentication error
      if (
        lowerError.includes('api key') ||
        lowerError.includes('unauthorized') ||
        lowerError.includes('forbidden')
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Resend authentication failed. Please ensure your RESEND_API_KEY in .env.local is valid.',
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message delivered successfully.',
    });
  } catch (err: unknown) {
    // Never expose stack trace or internal details/keys to client or console
    const clientMessage =
      err instanceof Error && err.message
        ? 'Failed to deliver message due to an unexpected server error.'
        : 'An unexpected error occurred while delivering your message.';

    return NextResponse.json(
      {
        success: false,
        error: clientMessage,
      },
      { status: 500 }
    );
  }
}
