import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 1. Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
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

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message (at least 5 characters).' },
        { status: 400 }
      );
    }

    const recipientEmail = 'dilkhushchoubey07@gmail.com';
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // 2. Resend API delivery (if RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
          to: [recipientEmail],
          reply_to: trimmedEmail,
          subject: `[Portfolio Enquiry] ${trimmedSubject}`,
          text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
        }),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.json().catch(() => ({}));
        return NextResponse.json(
          {
            success: false,
            error: errorData?.message || 'Failed to deliver message via Resend.',
          },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    // 3. Formspree API delivery (if FORMSPREE_FORM_ID is configured)
    if (process.env.FORMSPREE_FORM_ID) {
      const formspreeRes = await fetch(
        `https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            subject: trimmedSubject,
            message: trimmedMessage,
            _replyto: trimmedEmail,
          }),
        }
      );

      if (!formspreeRes.ok) {
        return NextResponse.json(
          { success: false, error: 'Formspree failed to process the submission.' },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    // 4. Web3Forms API delivery (if WEB3FORMS_ACCESS_KEY is configured)
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      const web3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          name: trimmedName,
          email: trimmedEmail,
          subject: `[Portfolio Enquiry] ${trimmedSubject}`,
          message: trimmedMessage,
          to: recipientEmail,
        }),
      });

      const web3Data = await web3Res.json().catch(() => ({}));
      if (!web3Data?.success) {
        return NextResponse.json(
          { success: false, error: web3Data?.message || 'Web3Forms submission failed.' },
          { status: 502 }
        );
      }

      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    }

    // 5. If no email service backend is configured in environment:
    // Do not falsely display a success message when email was not actually sent.
    // Return explicit error explaining required setup along with direct mailto fallback.
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      `[Portfolio Enquiry] ${trimmedSubject}`
    )}&body=${encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`
    )}`;

    return NextResponse.json(
      {
        success: false,
        isConfigError: true,
        error:
          'Email backend is not yet configured (e.g., RESEND_API_KEY or FORMSPREE_FORM_ID in .env.local). You can send this enquiry directly to dilkhushchoubey07@gmail.com using the link below.',
        fallbackMailto: mailtoUrl,
      },
      { status: 503 }
    );
  } catch (err: unknown) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected server error occurred. Please try again or email directly.',
      },
      { status: 500 }
    );
  }
}

