import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: 'Login Verification Code',
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
  };

  // Check if we're in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping email send');
    console.log('Email content:', msg);
    return;
  }

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('SendGrid Error:', error);
    throw new Error('Failed to send OTP email');
  }
}
